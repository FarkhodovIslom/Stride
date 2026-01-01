.PHONY: docker-up docker-down docker-build docker-logs docker-restart docker-logs-backend docker-logs-frontend

# Docker commands for Stride application

# Start development environment
docker-up:
	docker-compose up --build -d

# Stop and remove containers
docker-down:
	docker-compose down

# Stop and remove containers with volumes
docker-down-v:
	docker-compose down -v

# Rebuild containers without stopping
docker-build:
	docker-compose up --build -d

# View all logs
docker-logs:
	docker-compose logs -f

# View backend logs only
docker-logs-backend:
	docker-compose logs -f backend

# View frontend logs only
docker-logs-frontend:
	docker-compose logs -f frontend

# Restart all services
docker-restart:
	docker-compose down -v
	docker-compose up --build -d

# Production commands
docker-up-prod:
	docker-compose -f docker-compose.prod.yml up --build -d

docker-down-prod:
	docker-compose -f docker-compose.prod.yml down

# Database commands
docker-db-generate:
	docker-compose exec backend npm run db:generate

docker-db-push:
	docker-compose exec backend npm run db:push

docker-prisma-studio:
	docker-compose exec backend npx prisma studio

# Shell access
docker-shell-backend:
	docker-compose exec backend sh

docker-shell-frontend:
	docker-compose exec frontend sh

# Utility commands
docker-clean:
	docker-compose down -v
	docker system prune -af

docker-status:
	docker-compose ps

# Help
help:
	@echo "Available commands:"
	@echo "  docker-up          - Start development environment"
	@echo "  docker-down        - Stop containers"
	@echo "  docker-down-v      - Stop containers and remove volumes"
	@echo "  docker-build       - Rebuild containers"
	@echo "  docker-logs        - View all logs"
	@echo "  docker-logs-backend - View backend logs"
	@echo "  docker-logs-frontend - View frontend logs"
	@echo "  docker-restart     - Full restart with volume reset"
	@echo "  docker-up-prod     - Start production environment"
	@echo "  docker-down-prod   - Stop production environment"
	@echo "  docker-db-generate - Generate Prisma client"
	@echo "  docker-db-push     - Push database schema"
	@echo "  docker-prisma-studio - Open Prisma Studio"
	@echo "  docker-shell-backend - Shell into backend container"
	@echo "  docker-shell-frontend - Shell into frontend container"
	@echo "  docker-clean       - Clean up all Docker resources"
	@echo "  docker-status      - Show container status"
	@echo "  help               - Show this help message"

