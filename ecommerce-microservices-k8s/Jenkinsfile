pipeline {
  agent any

  environment {
    AWS_REGION = 'ap-south-1'
    ECR_REGISTRY = 'REPLACE_WITH_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build Images') {
      steps {
        sh '''
          docker build -t $ECR_REGISTRY/user-service:v1 ./user-service
          docker build -t $ECR_REGISTRY/product-service:v1 ./product-service
          docker build -t $ECR_REGISTRY/order-service:v1 ./order-service
          docker build -t $ECR_REGISTRY/payment-service:v1 ./payment-service
          docker build -t $ECR_REGISTRY/api-gateway:v1 ./api-gateway
        '''
      }
    }

    stage('Security Scan') {
      steps {
        sh 'trivy image $ECR_REGISTRY/user-service:v1'
        sh 'trivy image $ECR_REGISTRY/product-service:v1'
        sh 'trivy image $ECR_REGISTRY/order-service:v1'
        sh 'trivy image $ECR_REGISTRY/payment-service:v1'
        sh 'trivy image $ECR_REGISTRY/api-gateway:v1'
      }
    }

    stage('Push ECR') {
      steps {
        sh '''
          aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker push $ECR_REGISTRY/user-service:v1
          docker push $ECR_REGISTRY/product-service:v1
          docker push $ECR_REGISTRY/order-service:v1
          docker push $ECR_REGISTRY/payment-service:v1
          docker push $ECR_REGISTRY/api-gateway:v1
        '''
      }
    }

    stage('Deploy EKS') {
      steps {
        sh '''
          kubectl apply -f k8s/
        '''
      }
    }
  }
}
