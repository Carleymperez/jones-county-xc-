# Database Setup

## Current Setup: SQLite

Due to the small memory footprint of your Lightsail instance (416MB), we're using **SQLite** instead of MySQL. SQLite is:
- Lightweight (no separate service needed)
- Perfect for small to medium applications
- File-based (easy backups)
- No configuration required

## If You Need MySQL Later

If you need MySQL in the future, you have these options:

### Option 1: Upgrade Lightsail Instance
- Upgrade to at least 1GB RAM instance ($5/month)
- Then MySQL will run without issues

### Option 2: Use AWS RDS
- Managed MySQL service
- Separate from your Lightsail instance
- More expensive but fully managed

### Option 3: Use MariaDB
- Lighter than MySQL
- May work on 512MB instances with tuning

## SQLite Usage

SQLite is already configured in the backend. The database file will be created at:
```
/var/www/jones-county-xc/backend/data.db
```

No additional setup is needed - SQLite works out of the box!
