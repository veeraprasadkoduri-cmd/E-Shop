CREATE SCHEMA IF NOT EXISTS order_schema;
CREATE TABLE IF NOT EXISTS order_schema.orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  total_amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'CREATED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
