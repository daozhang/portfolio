#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting production deployment..."

# Check if required environment variables are set
required_vars=(
    "DATABASE_HOST"
    "DATABASE_USERNAME" 
    "DATABASE_PASSWORD"
    "DATABASE_NAME"
    "JWT_SECRET"
    "FIREBASE_PROJECT_ID"
    "FIREBASE_STORAGE_BUCKET"
    "CORS_ORIGIN"
    "VITE_API_BASE_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: $var environment variable is not set"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Build and deploy with Docker Compose
echo "🔨 Building production images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml run --rm backend npm run migration:run

echo "🚀 Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Health check
echo "🏥 Performing health checks..."
if curl -f http://localhost:${PORT:-3001}/api/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    exit 1
fi

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo "🎉 Production deployment completed successfully!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:${PORT:-3001}/api"