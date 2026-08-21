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
console.log(
  "Admin password loaded:",
  Boolean(process.env.ADMIN_PASSWORD)
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const adminTokens = new Set();

app.use(cors());
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

const order = {
  sessionId: session.id,
  customerEmail: session.customer_details?.email,
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

let orders = [];

if (fs.existsSync(ordersFile)) {
  
  const existing = fs.readFileSync(ordersFile, "utf8");

  if (existing.trim()) {
    orders = JSON.parse(existing);
  }
}

const alreadySaved = orders.some(
  (existingOrder) => existingOrder.sessionId === session.id
);

if (!alreadySaved) {
  orders.push(order);

  fs.writeFileSync(
    ordersFile,
    JSON.stringify(orders, null, 2)
  );

  console.log("✅ Order saved to orders.json");
} else {
  console.log("ℹ️ Order already saved — skipping duplicate");
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

      success_url: "http://localhost:5173/?checkout=success",
      cancel_url: "http://localhost:5173/?checkout=cancelled",
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