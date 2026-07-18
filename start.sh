#!/bin/bash
# NearbyConnect - Production startup script for 4GB VPS
# Usage: ./start.sh [build|start|stop|restart|logs|status]

set -e

COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[NearbyConnect]${NC} $1"; }
print_warn()   { echo -e "${YELLOW}[NearbyConnect]${NC} $1"; }
print_error()  { echo -e "${RED}[NearbyConnect]${NC} $1"; }

# Create .env if missing
if [ ! -f "$ENV_FILE" ]; then
    print_warn ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warn "Please edit .env and set secure values for DB_PASSWORD and JWT_SECRET"
fi

case "${1:-start}" in
    build)
        print_status "Building all containers..."
        docker compose -f $COMPOSE_FILE build --no-cache
        print_status "Build complete!"
        ;;

    start)
        print_status "Starting NearbyConnect (4GB VPS mode)..."
        docker compose -f $COMPOSE_FILE up -d
        print_status "Services started!"
        echo ""
        print_status "Frontend: http://localhost"
        print_status "Backend:  http://localhost:8080/api"
        print_status "MySQL:    localhost:3306"
        echo ""
        print_status "View logs: ./start.sh logs"
        ;;

    stop)
        print_status "Stopping all services..."
        docker compose -f $COMPOSE_FILE down
        print_status "All services stopped."
        ;;

    restart)
        print_status "Restarting all services..."
        docker compose -f $COMPOSE_FILE restart
        print_status "All services restarted!"
        ;;

    logs)
        docker compose -f $COMPOSE_FILE logs -f --tail=100
        ;;

    status)
        echo ""
        print_status "Container Status:"
        docker compose -f $COMPOSE_FILE ps
        echo ""
        print_status "Memory Usage:"
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" $(docker compose -f $COMPOSE_FILE ps -q) 2>/dev/null || true
        echo ""
        print_status "Disk Usage:"
        df -h / | tail -1
        ;;

    *)
        echo "Usage: $0 {build|start|stop|restart|logs|status}"
        echo ""
        echo "  build   - Build all Docker images"
        echo "  start   - Start all services (default)"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - View live logs"
        echo "  status  - Show container status and resource usage"
        exit 1
        ;;
esac
