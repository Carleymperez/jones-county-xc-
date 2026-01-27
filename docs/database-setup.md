# Database Setup

## SQLite

Due to the small memory footprint of the Lightsail instance (416MB), the backend uses **SQLite** via the pure-Go driver [`modernc.org/sqlite`](https://pkg.go.dev/modernc.org/sqlite). SQLite is:
- Lightweight (no separate service needed)
- Perfect for small to medium applications
- File-based (easy backups)
- No configuration required
- Compatible with `CGO_ENABLED=0` builds (pure Go, no C compiler needed)

## How It Works

The backend initializes SQLite on startup in `main.go`:
1. Opens (or creates) `data.db` in the working directory
2. Enables WAL mode for better read concurrency
3. Runs schema migrations to create tables

On the server, the database file lives at:
```
/var/www/jones-county-xc/backend/data.db
```

## Backups

SQLite databases are single files, so backups are straightforward:

```bash
# Simple file copy (stop service first for consistency)
sudo systemctl stop jones-county-xc
cp /var/www/jones-county-xc/backend/data.db /var/www/jones-county-xc/backend/data.db.backup
sudo systemctl start jones-county-xc

# Or use SQLite's built-in backup (safe while running)
sqlite3 /var/www/jones-county-xc/backend/data.db ".backup /tmp/data.db.backup"
```

## Local Development

No setup needed. Running the backend locally creates a `data.db` file in the `backend/` directory:

```bash
cd backend
go run .
# data.db is created automatically
```

## Inspecting the Database

```bash
# List tables
sqlite3 data.db ".tables"

# Show schema
sqlite3 data.db ".schema"

# Run a query
sqlite3 data.db "SELECT * FROM athletes;"
```
