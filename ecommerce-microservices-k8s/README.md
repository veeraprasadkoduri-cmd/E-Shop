# E-Commerce Microservices - Kubernetes/EKS Demo

A learning/demo e-commerce platform inspired by the type of marketplace architecture used by large online retailers.
This project uses four microservices:

1. User Service
2. Product Service
3. Order Service
4. Payment Service

Stack:
- Node.js + Express
- PostgreSQL
- Docker
- Amazon ECR
- Kubernetes / Amazon EKS
- Amazon RDS PostgreSQL
- Kubernetes ConfigMap + Secret
- Kubernetes Services
- AWS Load Balancer Controller / ALB
- SQL migration files

## Architecture

Internet
  |
 ALB / Ingress
  |
 API Gateway
  |
  +--> User Service ------+
  +--> Product Service ---+--> Amazon RDS PostgreSQL
  +--> Order Service -----+
  +--> Payment Service ---+

For a simple learning setup, all four service-owned schemas can live in one PostgreSQL RDS instance.
Each service owns its own schema and tables.

## Important design choice

The Kubernetes Deployment and Service files deploy application containers.
They do NOT create PostgreSQL tables.

Database schema/table creation is handled by migration SQL files:

- user-service/migrations/001-user-schema.sql
- product-service/migrations/001-product-schema.sql
- order-service/migrations/001-order-schema.sql
- payment-service/migrations/001-payment-schema.sql

The example uses a migration container/job pattern so schema creation can be automated during deployment.

## Local Docker Compose

```bash
docker compose up --build
```

Gateway:
http://localhost:8080

Health:
http://localhost:8080/health

## Kubernetes / EKS flow

1. Build four service images.
2. Push images to ECR.
3. Create RDS PostgreSQL.
4. Allow EKS node/pod security group to reach RDS on TCP 5432.
5. Create Kubernetes Secret and ConfigMap.
6. Update image names in k8s/*.yaml.
7. Apply namespace, config, secret, services, deployments and migration jobs.
8. Install AWS Load Balancer Controller in EKS.
9. Apply ingress.
10. Test the ALB endpoint.

Example:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.example.yaml
kubectl apply -f k8s/migrations/
kubectl apply -f k8s/services/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/ingress.yaml

kubectl get pods -n ecommerce
kubectl get svc -n ecommerce
kubectl get ingress -n ecommerce
```

## RDS values

Create these Kubernetes values:

ConfigMap:
- DB_HOST
- DB_PORT
- DB_NAME

Secret:
- DB_USERNAME
- DB_PASSWORD

Do not commit real passwords to Git.

## Migration

The migration Jobs run the SQL files against RDS. They are intentionally separate from the application Deployments.

For production, use a proper migration framework and CI/CD migration step, and manage secrets with AWS Secrets Manager/External Secrets or another secure secret-management solution.

## Demo API examples

Register:
POST /api/users
```json
{"name":"Veera","email":"veera@example.com"}
```

Create product:
POST /api/products
```json
{"name":"Office Chair","price":249.99}
```

Create order:
POST /api/orders
```json
{"userId":1,"productId":1,"quantity":2}
```

Create payment:
POST /api/payments
```json
{"orderId":1,"amount":499.98}
```

This is a training project, not a production-ready payment system.
