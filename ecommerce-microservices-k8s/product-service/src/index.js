const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const pool = new Pool();

app.get("/health", (_, res) => res.json({service:"product-service", status:"UP"}));

app.get("/products", async (_, res) => {
  const r = await pool.query("SELECT * FROM product_schema.products ORDER BY id");
  res.json(r.rows);
});

app.post("/products", async (req, res) => {
  const {name, price} = req.body;
  if (!name || price === undefined) return res.status(400).json({error:"name and price are required"});
  const r = await pool.query(
    "INSERT INTO product_schema.products(name,price) VALUES($1,$2) RETURNING *",
    [name,price]
  );
  res.status(201).json(r.rows[0]);
});

app.listen(process.env.PORT || 3002, "0.0.0.0", () => console.log("product-service started"));
