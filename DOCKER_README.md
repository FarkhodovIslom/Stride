# Docker Setup for Stride Learning Platform

This guide provides complete Docker configuration for running the Stride full-stack application with backend API and frontend Next.js application.

## Prerequisites

- [Docker](https://www.docker.com/) (v20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/) (v2.0 or higher)
- Make (for using Makefile commands)

## Quick Start

### 1. Clone and Navigate to Project

```bash
cd stride
```

### 2. Start Development Environment

```bash
docker-compose up --build
```

This will build and start:
- **Backend API**: http://localhost:4000
- **Frontend App**: http://localhost:3000
- **Database**: SQLite (persistent volume)

### 3. Stop the Application

```bash
docker-compose down
```

Or to stop and remove volumes:

```bash
docker-compose down -v
```

## Development Mode

### Using Make Commands

The project includes a Makefile for common Docker operations:

```bash
# Start development environment
make docker-up

# Stop and remove containers
make docker-down

# Rebuild containers
make docker-build

# View logs
make docker-logs

# Stop and rebuild from scratch
make docker-restart
```

### Manual Commands

```bash
# Build and start containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose stop

# Remove containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v
```

## Production Mode

### Build and Start Production Containers

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Access Production Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

### Stop Production

```bash
docker-compose -f docker-compose.prod.yml down
```

## Environment Variables

### Backend

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend

No additional environment variables required for development. For production, configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Project Structure

```
stride/
├── docker-compose.yml           # Development environment
├── docker-compose.prod.yml      # Production environment
├── Makefile                     # Docker commands shortcuts
├── backend/
│   ├── Dockerfile              # Development build
│   ├── Dockerfile.prod         # Production build
│   ├── .dockerignore           # Files to exclude from build
│   ├── .env.example            # Environment template
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── src/
│       └── index.ts            # Express server entry
├── frontend/
│   ├── Dockerfile              # Next.js container build
│   └── .dockerignore           # Files to exclude from build
└── README.md
```

## Development Workflow

### Hot Reload

Both frontend and backend support hot reload:

- **Backend**: Changes to `.ts` files trigger automatic restart
- **Frontend**: Changes to React components auto-refresh in browser

### Database Management

```bash
# Access Prisma Studio (web interface for database)
docker-compose exec backend npx prisma studio
```

### Running Commands in Containers

```bash
# Run backend commands
docker-compose exec backend npm run db:generate
docker-compose exec backend npm run db:push

# Run frontend commands
docker-compose exec frontend npm run lint

# Shell access
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Production Considerations

### Environment Setup

1. Generate a strong JWT secret:
   ```bash
   openssl rand -base64 32
   ```

2. Update backend `.env` file with production values

3. For PostgreSQL, modify the backend service in `docker-compose.prod.yml`:
   ```yaml
   backend:
     environment:
       - DATABASE_URL=postgresql://user:password@db:5432/stride
   ```

### Performance Tuning

- Increase Node.js memory limit for large builds
- Add reverse proxy (nginx) for SSL termination
- Use volume mounts for persistent data

### Security Recommendations

- Change default JWT_SECRET in production
- Use secrets management for sensitive values
- Configure CORS for your production domain
- Enable HTTPS in production

## Troubleshooting

### Port Already in Use

If ports 3000 or 4000 are already in use:

```bash
# Check what's using the port
lsof -i :3000
lsof -i :4000

# Or change ports in docker-compose.yml
```

### Container Won't Start

```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache
```

### Database Issues

```bash
# Reset database
docker-compose down -v
docker-compose up -d backend
docker-compose exec backend npm run db:generate
docker-compose exec backend npm run db:push
```

### Permission Issues

```bash
# Fix node_modules permissions
docker-compose exec frontend chown -R nodejs:nodejs /app/node_modules
docker-compose exec backend chown -R nodejs:nodejs /app/node_modules
```

## Additional Resources

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

