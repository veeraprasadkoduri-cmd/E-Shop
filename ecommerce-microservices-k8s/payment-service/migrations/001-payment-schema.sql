CREATE SCHEMA IF NOT EXISTS payment_schema;
CREATE TABLE IF NOT EXISTS payment_schema.payments (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  status VARCHAR(30) DEFAULT 'SUCCESS',
  transaction_ref VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
