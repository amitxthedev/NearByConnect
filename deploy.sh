#!/bin/bash

# NearbyConnect Production Deployment Script
# Run this on a fresh Ubuntu 22.04/24.04 VPS

set -e

echo "=== NearbyConnect Deployment ==="

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Install Java 17
sudo apt install openjdk-17-jdk -y

# Install Maven
sudo apt install maven -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Install MySQL
sudo apt install mysql-server -y

# Create database
sudo mysql -e "CREATE DATABASE IF NOT EXISTS nearbyconnect;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'nearby'@'localhost' IDENTIFIED BY '${DB_PASSWORD:-nearby2024}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON nearbyconnect.* TO 'nearby'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Create directories
sudo mkdir -p /var/www/nearbyconnect
sudo mkdir -p /var/uploads/nearbyconnect

# Copy project files
sudo cp -r frontend/dist/* /var/www/nearbyconnect/

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/nearbyconnect
sudo ln -sf /etc/nginx/sites-available/nearbyconnect /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Build and run with Docker Compose
docker-compose up -d --build

# Get SSL certificate
echo "Run: sudo certbot --nginx -d yourdomain.com"

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "=== Deployment Complete ==="
echo "Backend running on port 8080"
echo "Frontend running on port 80/443"
echo "Run 'sudo certbot --nginx -d yourdomain.com' for SSL"
