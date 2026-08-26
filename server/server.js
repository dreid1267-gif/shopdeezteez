import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import pg from "pg";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFile = path.join(__dirname, "orders.json");
dotenv.config({
  path: path.join(__dirname, ".env"),
});
console.log(
  "Stripe key loaded:",
  Boolean(process.env.STRIPE_SECRET_KEY)
);
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";
console.log(
  "Database URL loaded:",
  Boolean(process.env.DATABASE_URL)
);

console.log("Order storage: Neon database");
console.log(
  "Admin password loaded:",
  Boolean(process.env.ADMIN_PASSWORD)
);
console.log(
  "Printful token loaded:",
  Boolean(process.env.PRINTFUL_API_TOKEN)
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const adminTokens = new Set();

app.use(cors());

const printfulRequest = async (endpoint, options = {}) => {
  const response = await fetch(
    `https://api.printful.com${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Printful API request failed"
    );
  }

  return data.result;
};
const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

   const getPrintfulVariant = async (item) => {
  const products = await printfulRequest("/store/products");

  const itemName = normalizeText(item.product);
  const itemStyle = normalizeText(item.style);

  const matchingProduct = products.find((product) => {
    const productName = normalizeText(product.name);

   const isBlessedProduct =
  itemName.includes("blessed highly flavored");

if (!isBlessedProduct && !productName.includes(itemName)) {
  return false;
} 

    if (itemName.includes("blessed highly flavored")) {
      if (itemStyle.includes("front back")) {
        return productName.includes("front back");
      }

      return productName.includes("front only");
    }

    return true;
  });

  if (!matchingProduct) {
    throw new Error(
      `No matching Printful product found for ${item.product}`
    );
  }

  const productDetails = await printfulRequest(
    `/store/products/${matchingProduct.id}`
  );

  
console.log(
  "PRINTFUL VARIANTS:",
  productDetails.sync_variants.map((variant) => ({
    id: variant.id,
    name: variant.name
  }))
);
  const matchingVariant = productDetails.sync_variants.find((variant) => {
  const variantWords = normalizeText(variant.name).split(" ");
  const requestedSize = normalizeText(item.size);
  

  return variantWords.includes(requestedSize);
});

if (!matchingVariant) {
  throw new Error(
    `No matching Printful variant found for ${item.product}, ${item.size}, ${item.color}`
  );
}

return matchingVariant;
};
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("Webhook signature error:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
  const session = event.data.object;

 const lineItems = await stripe.checkout.sessions.listLineItems(
  session.id,
  {
    limit: 100,
    expand: ["data.price.product"],
  }
);

console.log("✅ PAYMENT COMPLETED");
console.log("Customer email:", session.customer_details?.email);
console.log("Amount paid:", session.amount_total / 100);

lineItems.data.forEach((item) => {
  const product = item.price?.product;
  const metadata = product?.metadata || {};

  console.log("--------------------");
  console.log("Product:", item.description);
  console.log("Style:", metadata.style);
  console.log("Size:", metadata.size);
  console.log("Color:", metadata.color);
  console.log("Quantity:", item.quantity);
  console.log("Amount:", item.amount_total / 100);
});
const shippingDetails =
  session.collected_information?.shipping_details ??
  session.shipping_details;
const order = {
  sessionId: session.id,
  customerEmail: session.customer_details?.email,
  customerName:
  shippingDetails?.name ?? session.customer_details?.name ?? "",
customerPhone: session.customer_details?.phone ?? "",
shippingAddress:
  shippingDetails?.address ?? session.customer_details?.address ?? null,
  amountPaid: session.amount_total / 100,
  createdAt: new Date().toISOString(),
  items: lineItems.data.map((item) => {
    const product = item.price?.product;
    const metadata = product?.metadata || {};

    return {
      product: item.description,
      style: metadata.style,
      size: metadata.size,
      color: metadata.color,
      quantity: item.quantity,
      amount: item.amount_total / 100,
    };
  }),
};

const saveResult = await pool.query(
  `
    INSERT INTO orders (
      session_id,
      customer_email,
      customer_name,
      customer_phone,
      shipping_address,
      amount_paid,
      status,
      created_at,
      items
    )
    VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9::jsonb)
    ON CONFLICT (session_id) DO NOTHING
    RETURNING session_id
  `,
  [
    order.sessionId,
    order.customerEmail,
    order.customerName,
    order.customerPhone,
    JSON.stringify(order.shippingAddress),
    order.amountPaid,
    "Received",
    order.createdAt,
    JSON.stringify(order.items),
  ]
);

if (saveResult.rowCount > 0) {
  console.log("✅ Order saved permanently to Neon");

  try {
    const printfulItems = [];

    for (const item of order.items) {
      const variant = await getPrintfulVariant(item);

      printfulItems.push({
        sync_variant_id: variant.id,
        quantity: item.quantity,
      });
    }

    const address = order.shippingAddress || {};

    const printfulOrder = await printfulRequest("/orders?confirm=1", {
      method: "POST",
      body: JSON.stringify({
        //external_id: order.sessionId,
        recipient: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          address1: address.line1,
          address2: address.line2 || "",
          city: address.city,
          state_code: address.state,
          country_code: address.country,
          zip: address.postal_code,
        },
        items: printfulItems,
      }),
    });

    console.log(
      "✅ Printful draft order created:",
      printfulOrder.id
    );
  } catch (printfulError) {
    console.error(
      "❌ Unable to create Printful draft order:",
      printfulError
    );
  }
} else {
  console.log("ℹ️ Order already exists — skipping duplicate");
}

console.log("Checkout session:", session.id);
}

res.json({ received: true });
  }
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Deez Teez server is running!");
});
app.get("/printful-products", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.printful.com/store/products",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Printful products error:", data);

      return res.status(response.status).json({
        error: "Unable to load Printful products",
      });
    }

    return res.json(data.result);
  } catch (error) {
    console.error("Printful products error:", error);

    return res.status(500).json({
      error: "Unable to load Printful products",
    });
    app.get("/printful-products/:id", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.printful.com/store/products/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Printful product details error:", data);

      return res.status(response.status).json({
        error: "Unable to load Printful product details",
      });
    }

    return res.json(data.result);
  } catch (error) {
    console.error("Printful product details error:", error);

    return res.status(500).json({
      error: "Unable to load Printful product details",
    });
  }
});
  }
});
app.get("/orders", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!adminTokens.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await pool.query(`
  SELECT
    session_id AS "sessionId",
    customer_email AS "customerEmail",
    customer_name AS "customerName",
    customer_phone AS "customerPhone",
    shipping_address AS "shippingAddress",
    amount_paid::float8 AS "amountPaid",
    status,
    created_at AS "createdAt",
    items
  FROM orders
  ORDER BY created_at DESC
`);

    return res.json(result.rows);
  } catch (error) {
    console.error("Unable to read database orders:", error);
    return res.status(500).json({ error: "Unable to load orders" });
  }
});
app.post("/admin-login", (req, res) => {
    const { password } = req.body;

  const enteredPassword = String(password ?? "").trim();
  const savedPassword = String(process.env.ADMIN_PASSWORD ?? "").trim();
  

  if (enteredPassword === savedPassword) {
    const token = crypto.randomUUID();

    adminTokens.add(token);

    return res.json({
      success: true,
      token,
    });
  }

  return res.status(401).json({
    success: false,
  });
});

app.post("/admin-logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
    });
  }

  const token = authHeader.replace("Bearer ", "");

  adminTokens.delete(token);

  return res.json({
    success: true,
  });
});
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
shipping_address_collection: {
  allowed_countries: ["US"],
},

phone_number_collection: {
  enabled: true,
},

      line_items: req.body.cart.map((item) => ({
        price_data: {
          currency: "usd",

          product_data: {
            name: item.name,
            description: `${item.style} | Size: ${item.size} | Color: ${item.color}`,
            metadata: {
              style: item.style,
              size: item.size,
              color: item.color,
            },
          },

          unit_amount: Math.round(
            Number(item.price.replace("$", "")) * 100
          ),
        },

        quantity: 1,
      })),
      shipping_options: [
  {
    shipping_rate_data: {
      type: "fixed_amount",
      fixed_amount: {
        amount: 475,
        currency: "usd",
      },
      display_name: "Standard Shipping",
    },
  },
],

      success_url: `${FRONTEND_URL}/?checkout=success`,
cancel_url: `${FRONTEND_URL}/?checkout=cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to create checkout session",
    });
  }
  });
app.get("/orders", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!adminTokens.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (!fs.existsSync(ordersFile)) {
      return res.json([]);
    }

    const existing = fs.readFileSync(ordersFile, "utf8");

    if (!existing.trim()) {
      return res.json([]);
    }

    const orders = JSON.parse(existing);

    res.json(orders);
  } catch (error) {
    console.error("Unable to read orders:", error);
    res.status(500).json({ error: "Unable to load orders" });
  }
});

    
const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
  console.log(`Deez Teez server running on port ${PORT}`);
});
app.get("/printful-products", async (req, res) => {
  try {
    const response = await fetch("https://api.printful.com/store/products", {
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Printful products error:", data);

      return res.status(response.status).json({
        error: "Unable to load Printful products",
      });
    }

    return res.json(data.result);
  } catch (error) {
    console.error("Printful connection error:", error);

    return res.status(500).json({
      error: "Printful connection failed",
    });
  }
});