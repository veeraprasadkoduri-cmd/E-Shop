# Kubernetes deployment order

1. Create EKS and configure kubectl.
2. Create RDS PostgreSQL in the same VPC as EKS.
3. RDS Security Group: allow TCP 5432 only from the EKS application/node security group as appropriate.
4. Edit configmap.yaml and secret.example.yaml.
5. Replace ECR image placeholders in deployment YAML files.
6. Install AWS Load Balancer Controller in EKS before applying ingress.
7. Apply:

```bash
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.example.yaml
kubectl apply -f migrations/
kubectl apply -f services/
kubectl apply -f deployments/
kubectl apply -f ingress.yaml
```

8. Check:

```bash
kubectl get pods -n ecommerce
kubectl get jobs -n ecommerce
kubectl get svc -n ecommerce
kubectl get ingress -n ecommerce
```

## Important

The migration Jobs are intentionally separate from application Deployments. They create the schemas/tables in RDS.

The sample assumes all four schemas are in the `ecommerce` PostgreSQL database:

- user_schema
- product_schema
- order_schema
- payment_schema

For a real production system, run migrations through a controlled CI/CD migration step and use a proper secret-management solution.
