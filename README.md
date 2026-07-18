# NearbyConnect

Anonymous local communities. Connect with your city without revealing who you are.

Live: [nearbyconnect.fun](https://nearbyconnect.fun)

## Features

- Anonymous user profiles with auto-generated identities
- Real-time community & direct messaging (WebSocket)
- 135+ communities across 35+ countries
- 45+ interest categories with search
- Worldwide city database with country → city cascading selector
- User reporting & moderation system
- Admin dashboard with analytics
- CAPTCHA-protected authentication
- Cookie consent with accept/decline
- Privacy Policy & Terms of Service pages
- Mobile-first responsive design (PWA-ready)

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, Zustand, TanStack Query, Framer Motion, React Router  
**Backend:** Spring Boot, Spring Security, Spring WebSocket, Hibernate, MySQL  
**Deployment:** Docker Compose, Nginx, AWS EC2

## Getting Started

### Prerequisites

- Docker & Docker Compose
- 4GB+ RAM VPS (or local machine)

### Setup

```bash
git clone https://github.com/yourusername/NearbyConnect.git
cd NearbyConnect
cp .env.example .env
```

Edit `.env` with secure values:

```bash
DB_PASSWORD=your-strong-password
JWT_SECRET=openssl rand -base64 64
CORS_ORIGINS=https://nearbyconnect.fun
WS_ORIGINS=https://nearbyconnect.fun
```

### Build & Run

```bash
chmod +x start.sh
./start.sh build
./start.sh start
```

### Commands

```bash
./start.sh build     # Build all Docker images
./start.sh start     # Start all services
./start.sh stop      # Stop all services
./start.sh restart   # Restart all services
./start.sh logs      # View live logs
./start.sh status    # Show container status & memory usage
```

## Project Structure

```
NearbyConnect/
├── frontend/          # React 19 + Vite
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API layer
│   │   ├── stores/       # Zustand state
│   │   └── utils/        # Helpers
│   ├── public/           # Static assets
│   ├── nginx.conf        # Production nginx
│   └── Dockerfile
├── backend/           # Spring Boot
│   ├── src/main/java/
│   │   ├── controller/   # REST endpoints
│   │   ├── service/      # Business logic
│   │   ├── repository/   # JPA repositories
│   │   ├── dto/          # Data transfer objects
│   │   └── config/       # Security, WebSocket config
│   └── Dockerfile
├── docker-compose.yml
├── start.sh
└── .env.example
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/communities` | List communities |
| POST | `/api/v1/communities` | Create community |
| POST | `/api/v1/communities/{id}/join` | Join community |
| GET | `/api/v1/cities/country/{country}` | Cities by country |
| GET | `/api/v1/interests` | List interests |
| GET | `/api/v1/interests/search?q=` | Search interests |
| WS | `/ws` | WebSocket endpoint |

## Deployment (AWS EC2)

1. Launch Ubuntu EC2 instance (4GB RAM, 15GB SSD)
2. Open ports 80, 443, 22 in security group
3. SSH in and install Docker:
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose-plugin
   sudo usermod -aG docker ubuntu
   newgrp docker
   ```
4. Clone repo and start:
   ```bash
   git clone https://github.com/yourusername/NearbyConnect.git
   cd NearbyConnect
   cp .env.example .env
   ./start.sh build && ./start.sh start
   ```
5. Point DNS A record to EC2 public IP

## License

MIT
