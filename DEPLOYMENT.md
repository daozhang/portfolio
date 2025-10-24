# Production Deployment Guide

## Prerequisites

1. **Docker and Docker Compose** installed on the production server
2. **PostgreSQL database** (managed service recommended)
3. **Firebase project** with Storage enabled
4. **Domain name** and SSL certificate (optional but recommended)

## Environment Variables

Create a `.env` file in the project root with the following variables:

### Database Configuration
```bash
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-db-username
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=designer_portfolio
DATABASE_SSL=true
```

### JWT Configuration
```bash
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters
```

### Firebase Configuration
```bash
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

### Application Configuration
```bash
PORT=3001
CORS_ORIGIN=https://your-domain.com
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Deployment Steps

### 1. Clone Repository
```bash
git clone <repository-url>
cd designer-portfolio-platform
```

### 2. Set Environment Variables
```bash
# Copy and edit environment variables
cp .env.example .env
# Edit .env with your production values
```

### 3. Run Deployment Script
```bash
./scripts/deploy.sh
```

### 4. Verify Deployment
- Frontend: http://localhost (or your domain)
- Backend API: http://localhost:3001/api (or your API domain)
- Health checks: 
  - Backend: http://localhost:3001/api/health
  - Frontend: http://localhost/health

## Manual Deployment (Alternative)

If you prefer manual deployment:

### 1. Build Images
```bash
docker-compose -f docker-compose.prod.yml build
```

### 2. Run Database Migrations
```bash
docker-compose -f docker-compose.prod.yml run --rm backend npm run migration:run
```

### 3. Start Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## SSL/HTTPS Setup

For production, it's recommended to use a reverse proxy like Nginx or Traefik with SSL certificates:

### Using Nginx (example)
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring and Maintenance

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Update Application
```bash
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Database Backup
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec backend npm run migration:generate -- -n BackupMigration

# Or use pg_dump if using external PostgreSQL
pg_dump -h $DATABASE_HOST -U $DATABASE_USERNAME -d $DATABASE_NAME > backup.sql
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_* environment variables
   - Ensure database server is accessible
   - Verify SSL settings for managed databases

2. **Firebase Storage Issues**
   - Verify Firebase service account credentials
   - Check Firebase Storage bucket permissions
   - Ensure FIREBASE_STORAGE_BUCKET is correct

3. **CORS Errors**
   - Update CORS_ORIGIN to match your frontend domain
   - Ensure protocol (http/https) matches

4. **Health Check Failures**
   - Check if services are running: `docker-compose -f docker-compose.prod.yml ps`
   - View logs: `docker-compose -f docker-compose.prod.yml logs`
   - Verify port accessibility

### Performance Optimization

1. **Database**
   - Use connection pooling
   - Add database indexes for frequently queried fields
   - Consider read replicas for high traffic

2. **Media Storage**
   - Use CDN for Firebase Storage
   - Implement image optimization pipeline
   - Add caching headers

3. **Application**
   - Enable gzip compression (already configured in nginx)
   - Use Redis for session storage (optional)
   - Implement application-level caching

## Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Database SSL enabled
- [ ] HTTPS/SSL certificates configured
- [ ] Firewall rules configured
- [ ] Regular security updates
- [ ] Environment variables secured
- [ ] Firebase security rules configured
- [ ] Rate limiting enabled (implemented in next task)
- [ ] Input validation enabled (implemented in next task)