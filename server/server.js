import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
console.log(
  "Stripe key loaded:",
  Boolean(process.env.STRIPE_SECRET_KEY)
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

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
  

  console.log("Checkout session:", session.id);
}

    res.json({ received: true });
  }
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Deez Teez server is running!");
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
    res.status(500).json({ error: "Unable to create checkout session" });
  }
});

const PORT = 4242;

app.listen(PORT, () => {
  console.log(`Deez Teez server running on port ${PORT}`);
});