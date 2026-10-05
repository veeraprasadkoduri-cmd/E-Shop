const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.get("/health", (_, res) => res.json({service:"api-gateway", status:"UP"}));

const routes = {
  "/api/users": "http://user-service:3001",
  "/api/products": "http://product-service:3002",
  "/api/orders": "http://order-service:3003",
  "/api/payments": "http://payment-service:3004"
};

for (const [path, target] of Object.entries(routes)) {
  app.use(path, createProxyMiddleware({
    target,
    changeOrigin:true,
    pathRewrite: { [`^${path}`]: "" }
  }));
}

app.listen(process.env.PORT || 8080, "0.0.0.0", () => console.log("api-gateway started"));
