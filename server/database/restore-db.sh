#!/bin/bash

# MongoDB Restore Script
# This script restores the vocabulary database from a backup file

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="vocabulary"
CONTAINER_NAME="vocabulary-mongodb"
BACKUP_FILE="./dump-data.gz"

# Function to display usage
usage() {
    echo -e "${YELLOW}Usage: $0 [backup_path]${NC}"
    echo ""
    echo "If no backup_path is provided, dump-data.gz will be used."
    echo ""
    echo "Examples:"
    echo "  $0                      # Restore from dump-data.gz"
    echo "  $0 path/to/backup.gz    # Restore from specific backup"
    exit 1
}

# Prompt for confirmation
confirm_restore() {
    echo -e "${RED}WARNING: This will replace the current database with the backup!${NC}"
    read -p "Are you sure you want to continue? (yes/no): " confirmation
    if [ "$confirmation" != "yes" ]; then
        echo -e "${YELLOW}Restore cancelled.${NC}"
        exit 0
    fi
}

# Determine backup path
if [ -z "$1" ]; then
    BACKUP_PATH="${BACKUP_FILE}"
else
    BACKUP_PATH="$1"
fi

# Check if backup exists
if [ ! -f "${BACKUP_PATH}" ]; then
    echo -e "${RED}✗ Backup not found: ${BACKUP_PATH}${NC}"
    exit 1
fi

echo -e "${YELLOW}Backup to restore: ${BACKUP_PATH}${NC}"
SIZE=$(du -sh "${BACKUP_PATH}" | cut -f1)
echo -e "${YELLOW}Backup size: ${SIZE}${NC}"

# Confirm restore
confirm_restore

echo -e "${YELLOW}Starting MongoDB restore...${NC}"

# Check if MongoDB container is running
if ! docker ps | grep -q "${CONTAINER_NAME}"; then
    echo -e "${RED}✗ MongoDB container '${CONTAINER_NAME}' is not running!${NC}"
    echo -e "${YELLOW}Please start the container with: docker-compose up -d mongodb${NC}"
    exit 1
fi

# Restore from gzip archive directly
echo -e "${YELLOW}Restoring from compressed archive...${NC}"
cat "${BACKUP_PATH}" | docker exec -i "${CONTAINER_NAME}" \
    mongorestore --authenticationDatabase=admin \
                 --username=admin \
                 --password=password123 \
                 --gzip \
                 --archive \
                 --drop

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database restored successfully!${NC}"
else
    echo -e "${RED}✗ Database restore failed!${NC}"
    exit 1
fi
