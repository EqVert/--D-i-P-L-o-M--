#!/bin/bash

# Перевіряємо, чи запущений Docker
if ! pgrep -f "Docker Desktop" > /dev/null; then
    echo "Docker is not running. Starting Docker..."
    
    # Запускаємо Docker
    open -a Docker

    # Очікуємо, поки Docker повністю запуститься
    while ! docker info >/dev/null 2>&1; do
        echo "Waiting for Docker to start..."
        sleep 2
    done

    echo "Docker has started successfully."
else
    echo "Docker is already running."
fi

echo "Starting Docker Compose services..."
docker compose up -d

echo "Starting development server..."
npm run dev