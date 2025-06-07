# Stop all containers and remove volumes
Write-Host "Stopping containers and removing volumes..."
docker-compose down -v

# Start containers again
Write-Host "Starting containers..."
docker-compose up -d

Write-Host "Database has been reset. The application will reinitialize the data on startup."
Write-Host "You can check the logs with: docker-compose logs -f backend" 