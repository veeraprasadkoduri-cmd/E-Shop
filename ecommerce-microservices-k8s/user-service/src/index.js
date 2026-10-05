const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const pool = new Pool();

app.get("/health", (_, res) => res.json({service:"user-service", status:"UP"}));

app.get("/users", async (_, res) => {
  const r = await pool.query("SELECT * FROM user_schema.users ORDER BY id");
  res.json(r.rows);
});

app.post("/users", async (req, res) => {
  const {name, email} = req.body;
  if (!name || !email) return res.status(400).json({error:"name and email are required"});
  const r = await pool.query(
    "INSERT INTO user_schema.users(name,email) VALUES($1,$2) RETURNING *",
    [name,email]
  );
  res.status(201).json(r.rows[0]);
});

app.listen(process.env.PORT || 3001, "0.0.0.0", () => console.log("user-service started"));
