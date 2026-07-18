#!/bin/bash
# NearbyConnect - One-command deploy
# Usage: bash deploy.sh

set -e

APP_DIR="/root/NearByConnect"
BRANCH="main"
DB_NAME="nearbyconnect_dev"
DB_USER="nearby"
DB_PASS="nearby123"
JWT_SECRET="ZmRvd2p0ODgyMTM1NjQ3ODkxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNA=="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[...]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; exit 1; }

cd "$APP_DIR" || fail "Directory $APP_DIR not found"

# ==================
# 0. Pull latest code
# ==================
warn "Pulling latest code from GitHub..."
git fetch origin "$BRANCH" 2>/dev/null || warn "Git fetch failed, using local code"
LOCAL=$(git rev-parse HEAD 2>/dev/null || echo "")
REMOTE=$(git rev-parse origin/$BRANCH 2>/dev/null || echo "")
if [ "$LOCAL" != "$REMOTE" ] 2>/dev/null; then
    git reset --hard "origin/$BRANCH"
    git clean -fd
    ok "Code updated from GitHub"
else
    ok "Already up to date"
fi

# ==================
# 1. Install deps
# ==================
warn "Installing dependencies..."

if ! command -v java &> /dev/null; then
    apt-get update -qq
    apt-get install -y -qq openjdk-17-jdk nginx curl git > /dev/null 2>&1
    ok "Java + Nginx + Git installed"
else
    ok "Java already installed"
fi

if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
    apt-get install -y -qq nodejs > /dev/null 2>&1
    ok "Node.js installed"
else
    ok "Node.js already installed"
fi

if ! command -v mvn &> /dev/null; then
    apt-get install -y -qq maven > /dev/null 2>&1
    ok "Maven installed"
else
    ok "Maven already installed"
fi

# ==================
# 2. Setup MySQL
# ==================
warn "Setting up MySQL..."

if ! command -v mysql &> /dev/null; then
    apt-get install -y -qq mysql-server > /dev/null 2>&1
    ok "MySQL installed"
fi

if ! systemctl is-active --quiet mysql; then
    systemctl start mysql
    systemctl enable mysql
    ok "MySQL started"
fi

mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};" 2>/dev/null || true
mysql -u root -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';" 2>/dev/null || true
mysql -u root -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null || true
ok "Database ready"

# ==================
# 3. Write prod config
# ==================
warn "Writing application config..."

cat > backend/src/main/resources/application-prod.properties << PROPFILE
spring.datasource.url=jdbc:mysql://localhost:3306/${DB_NAME}?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=20000

spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false

app.cors.allowed-origins=*
app.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
app.cors.allowed-headers=*
app.cors.allow-credentials=true
app.cors.max-age=3600

app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
app.jwt.refresh-expiration=604800000
app.jwt.header=Authorization
app.jwt.prefix=Bearer

app.websocket.allowed-origins=*

logging.level.com.nearbyconnect=INFO
logging.level.org.springframework.security=WARN
management.endpoints.web.exposure.include=health
management.endpoint.health.show-details=never
PROPFILE

ok "Config written"

# ==================
# 4. Build frontend
# ==================
warn "Building frontend..."
cd frontend
npm install --silent
npm run build --silent
cd ..
ok "Frontend built"

# ==================
# 5. Build backend
# ==================
warn "Building backend..."
cd backend
mvn package -DskipTests -q
cd ..
JAR_FILE=$(ls backend/target/*.jar | grep -v original | head -1)
ok "Backend built: $(basename $JAR_FILE)"

# ==================
# 6. Setup Nginx
# ==================
warn "Configuring Nginx..."

rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

cat > /etc/nginx/sites-available/nearbyconnect << 'NGINX'
server {
    listen 80;
    server_name nearbyconnect.fun www.nearbyconnect.fun _;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    root /root/NearByConnect/frontend/dist;
    index index.html;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8084;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 30s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
NGINX

ln -sf /etc/nginx/sites-available/nearbyconnect /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
ok "Nginx configured"

# ==================
# 7. Fix permissions
# ==================
chmod 755 /root
chmod -R 755 frontend/dist
ok "Permissions fixed"

# ==================
# 8. Setup systemd service
# ==================
warn "Creating systemd service..."

cat > /etc/systemd/system/nearbyconnect-backend.service << EOF
[Unit]
Description=NearbyConnect Backend
After=network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar ${APP_DIR}/${JAR_FILE} --spring.profiles.active=prod
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable nearbyconnect-backend
systemctl restart nearbyconnect-backend
ok "Backend service created"

# ==================
# 9. Setup auto-deploy
# ==================
warn "Setting up auto-deploy..."

cat > auto-deploy.sh << 'AUTOEOF'
#!/bin/bash
set -e
cd /root/NearByConnect
git fetch origin main 2>/dev/null || exit 0
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
[ "$LOCAL" = "$REMOTE" ] && exit 0
git reset --hard origin/main
git clean -fd
cd frontend && npm install --silent && npm run build --silent && cd ..
cd backend && mvn package -DskipTests -q && cd ..
JAR_FILE=$(ls backend/target/*.jar | grep -v original | head -1)
sed -i "s|ExecStart=.*|ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar /root/NearByConnect/${JAR_FILE} --spring.profiles.active=prod|" /etc/systemd/system/nearbyconnect-backend.service
systemctl daemon-reload
systemctl restart nearbyconnect-backend
echo "Deploy completed at $(date)"
AUTOEOF

chmod +x auto-deploy.sh

# Remove old cron entries, add new one
(crontab -l 2>/dev/null | grep -v auto-deploy; echo "*/3 * * * * /root/NearByConnect/auto-deploy.sh >> /root/NearByConnect/deploy.log 2>&1") | crontab -
ok "Auto-deploy active (every 3 min)"

# ==================
# 10. Wait and verify
# ==================
echo ""
echo "Waiting for backend to start..."
sleep 15

echo ""
echo "========================================="
echo -e "${GREEN}DEPLOY COMPLETE${NC}"
echo "========================================="
echo ""
echo "  Backend:  $(curl -s http://localhost:8084/api/v1/interests | head -c 50)..."
echo "  Frontend: $(curl -s -o /dev/null -w '%{http_code}' http://localhost)"
echo ""
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "unknown")
echo "  Local:    http://localhost"
echo "  Public:   http://${PUBLIC_IP}"
echo "  Domain:   https://nearbyconnect.fun"
echo "========================================="
