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

sudo systemctl restart nearbyconnect-backend

echo "Deploy finished at $(date)"
echo "========================================="
