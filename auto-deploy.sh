#!/bin/bash
# NearbyConnect - Auto-deploy script
# Checks for new commits every 3 minutes via cron
# Cron: */3 * * * * /home/ubuntu/NearbyConnect/auto-deploy.sh >> /home/ubuntu/NearbyConnect/deploy.log 2>&1

set -e

APP_DIR="/home/ubuntu/NearbyConnect"
BRANCH="main"

cd "$APP_DIR"

# Fetch latest from remote
git fetch origin "$BRANCH" 2>/dev/null || exit 0

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
    exit 0
fi

echo ""
echo "========================================="
echo "Deploy started at $(date)"
echo "========================================="

# Pull latest changes
git reset --hard "origin/$BRANCH"
git clean -fd

# Rebuild and restart
docker compose build --no-cache
docker compose up -d --force-recreate

echo "Deploy finished at $(date)"
echo "========================================="
