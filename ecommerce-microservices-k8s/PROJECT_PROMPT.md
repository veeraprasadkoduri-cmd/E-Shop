# Prompt: Generate/Explain This Project

Act as a senior AWS DevOps/Kubernetes engineer and explain/build a complete e-commerce microservices demo inspired by a large marketplace such as Wayfair, without copying proprietary code or branding.

Requirements:
- Four independent microservices: User, Product, Order, Payment.
- Node.js/Express REST APIs.
- PostgreSQL database.
- Dockerfile for every service.
- Docker Compose for local development.
- Local Compose may use four PostgreSQL containers and init SQL files.
- Build Docker images and push them to Amazon ECR.
- Deploy application containers to Amazon EKS.
- For AWS production-style database, use Amazon RDS PostgreSQL instead of PostgreSQL Pods.
- Explain RDS endpoint, Security Group, TCP 5432, IAM versus database credentials.
- Use one RDS PostgreSQL database with service-owned schemas for this learning project:
  user_schema, product_schema, order_schema, payment_schema.
- Define table structures in migration SQL files, not ConfigMaps.
- Use Kubernetes ConfigMap for DB host/port/name and Kubernetes Secret for DB credentials.
- Use separate Kubernetes Migration Jobs to execute the SQL against RDS.
- Create a Deployment and ClusterIP Service for each microservice.
- Create an API Gateway service and route /api/users, /api/products, /api/orders, /api/payments.
- Use AWS Load Balancer Controller and an Ingress that creates an ALB.
- Include readiness/liveness probes.
- Include a Jenkins pipeline for build, Trivy scan, ECR push and EKS deployment.
- Do not put real credentials in Git.
- Clearly explain every step from AWS permissions/VPC/RDS/EKS to application testing.
- Keep the architecture simple enough for a DevOps interview project.
