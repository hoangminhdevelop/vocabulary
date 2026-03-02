#!/bin/bash

# MongoDB Export Script
# This script exports the vocabulary database to a backup file

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="vocabulary"
CONTAINER_NAME="vocabulary-mongodb"
BACKUP_FILE="./dump-data.gz"

echo -e "${YELLOW}Starting MongoDB export...${NC}"

# Check if MongoDB container is running
if ! docker ps | grep -q "${CONTAINER_NAME}"; then
    echo -e "${RED}✗ MongoDB container '${CONTAINER_NAME}' is not running!${NC}"
    echo -e "${YELLOW}Please start the container with: docker-compose up -d mongodb${NC}"
    exit 1
fi

# Run mongodump with gzip archive inside the container and save to host
echo -e "${YELLOW}Creating compressed database archive...${NC}"
docker exec "${CONTAINER_NAME}" \
    mongodump --authenticationDatabase=admin \
              --username=admin \
              --password=password123 \
              --db="${DB_NAME}" \
              --gzip \
              --archive | cat > "${BACKUP_FILE}"

# Check if export was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database exported successfully to: ${BACKUP_FILE}${NC}"
    
    # Display backup size
    if [ -f "${BACKUP_FILE}" ]; then
        SIZE=$(du -sh "${BACKUP_FILE}" | cut -f1)
        echo -e "${GREEN}Backup size: ${SIZE}${NC}"
    fi
else
    echo -e "${RED}✗ Database export failed!${NC}"
    exit 1
fi
