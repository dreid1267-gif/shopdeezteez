import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Deez Teez server is running!");
});

const PORT = 4242;

app.listen(PORT, () => {
  console.log(`Deez Teez server running on port ${PORT}`);
});