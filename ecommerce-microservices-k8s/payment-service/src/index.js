const express = require("express");
const crypto = require("crypto");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const pool = new Pool();

app.get("/health", (_, res) => res.json({service:"payment-service", status:"UP"}));

app.get("/payments", async (_, res) => {
  const r = await pool.query("SELECT * FROM payment_schema.payments ORDER BY id");
  res.json(r.rows);
});

app.post("/payments", async (req, res) => {
  const {orderId, amount} = req.body;
  if (!orderId || amount === undefined) return res.status(400).json({error:"orderId and amount are required"});
  const ref = "TXN-" + crypto.randomBytes(6).toString("hex").toUpperCase();
  const r = await pool.query(
    "INSERT INTO payment_schema.payments(order_id,amount,status,transaction_ref) VALUES($1,$2,'SUCCESS',$3) RETURNING *",
    [orderId,amount,ref]
  );
  res.status(201).json(r.rows[0]);
});

app.listen(process.env.PORT || 3004, "0.0.0.0", () => console.log("payment-service started"));
