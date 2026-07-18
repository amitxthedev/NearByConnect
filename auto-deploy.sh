#!/bin/bash
set -e

APP_DIR="/root/NearByConnect"
BRANCH="main"

cd "$APP_DIR"

git fetch origin "$BRANCH" 2>/dev/null || exit 0

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
    exit 0
fi

echo "========================================="
echo "Deploy started at $(date)"
echo "========================================="

git reset --hard "origin/$BRANCH"
git clean -fd

cd frontend && npm install && npm run build && cd ..

cd backend && mvn package -DskipTests && cd ..

JAR_FILE=$(ls backend/target/*.jar | grep -v original | head -1)

# Update systemd service with latest jar
sed -i "s|ExecStart=.*|ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar /root/NearByConnect/${JAR_FILE} --spring.profiles.active=prod|" /etc/systemd/system/nearbyconnect-backend.service
sudo systemctl daemon-reload
sudo systemctl restart nearbyconnect-backend

# Update nginx config if it changed
if git diff HEAD~1 --name-only | grep -q "nginx.conf\|frontend/nginx.conf"; then
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

    location = /robots.txt {
        default_type text/plain;
        add_header Cache-Control "public, max-age=86400";
    }

    location = /sitemap.xml {
        default_type application/xml;
        add_header Cache-Control "public, max-age=86400";
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
    sudo nginx -t && sudo systemctl reload nginx
    echo "Nginx config updated"
fi

echo "Deploy finished at $(date)"
echo "========================================="
