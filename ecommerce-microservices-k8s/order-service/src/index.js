const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const pool = new Pool();

app.get("/health", (_, res) => res.json({service:"order-service", status:"UP"}));

app.get("/orders", async (_, res) => {
  const r = await pool.query("SELECT * FROM order_schema.orders ORDER BY id");
  res.json(r.rows);
});

app.post("/orders", async (req, res) => {
  const {userId, productId, quantity} = req.body;
  if (!userId || !productId || !quantity) return res.status(400).json({error:"userId, productId and quantity are required"});
  // Demo pricing: in a real system, call Product Service and calculate the authoritative price there.
  const total = Number(req.body.totalAmount || 0);
  const r = await pool.query(
    "INSERT INTO order_schema.orders(user_id,product_id,quantity,total_amount) VALUES($1,$2,$3,$4) RETURNING *",
    [userId,productId,quantity,total]
  );
  res.status(201).json(r.rows[0]);
});

app.listen(process.env.PORT || 3003, "0.0.0.0", () => console.log("order-service started"));
