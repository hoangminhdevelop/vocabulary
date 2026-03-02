# Database Backup & Restore Scripts

This folder contains scripts to export and restore the MongoDB vocabulary database.

## Scripts

### `export-db.sh` - Export Database

Exports the vocabulary database to a compressed gzip archive.

**Usage:**

```bash
cd server/database
./export-db.sh
```

**Features:**

- Creates compressed backup as `dump-data.gz`
- Runs mongodump inside the MongoDB Docker container with `--gzip --archive` flags
- Shows backup size
- Overwrites existing backup file

**Output:**

```
server/database/dump-data.gz
```

### `restore-db.sh` - Restore Database

Restores the vocabulary database from a backup file.

**Usage:**

Restore from dump-data.gz:

```bash
cd server/database
./restore-db.sh
```

Restore from specific backup:

```bash
cd server/database
./restore-db.sh path/to/backup.gz
```

**Features:**

- Prompts for confirmation before restoring (to prevent accidental data loss)
- Uses `--drop` flag to replace existing data
- Runs mongorestore inside the MongoDB Docker container
- Shows backup size before restoring
- Reads gzip archives directly without extraction using `--gzip --archive` flags

## Requirements

- Docker must be running with the `vocabulary-mongodb` container active
- MongoDB tools (`mongodump`, `mongorestore`) are included in the MongoDB container

## Database Configuration

- **Database Name:** vocabulary
- **Container Name:** vocabulary-mongodb
- **Username:** admin
- **Password:** password123
- **Port:** 27017

## Examples

### Export Database

```bash
# Run from server/database directory
./export-db.sh
```

### Restore Database

```bash
./restore-db.sh
```

### Restore from Specific Backup

```bash
./restore-db.sh path/to/backup.gz
```

## Troubleshooting

### Container Not Running

If you get an error about the container not being found:

```bash
# Check if container is running
docker ps | grep vocabulary-mongodb

# Start the container
docker-compose up -d mongodb
```

### Permission Denied

If you get permission denied errors:

```bash
# Make scripts executable
chmod +x export-db.sh restore-db.sh
```

### Backup Not Found

If restore can't find the backup:

```bash
# Check if dump-data.gz exists
ls -lh dump-data.gz

# Ensure you're in the correct directory
cd server/database
```

## Notes

- Export creates a single `dump-data.gz` file (overwrites existing backup)
- Backups use MongoDB's native gzip compression (`--gzip --archive`)
- Backups include all collections in the vocabulary database
- The restore operation will **drop** existing collections before restoring
- The restore reads compressed archives directly without extraction
- No intermediate files or directories are created
- Always test restores in a non-production environment first
- For version control, consider copying `dump-data.gz` to a timestamped backup location manually
- Keep regular backups in a secure location
