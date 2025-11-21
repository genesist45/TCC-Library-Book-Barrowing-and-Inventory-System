# ⚡ Quick Commands Reference

## 🚀 First Time Setup (New Device)
```bash
# 1. Install dependencies and configure
composer setup

# 2. Create SQLite database file (if using SQLite)
type nul > database/database.sqlite

# 3. Configure .env file (edit manually)

# 4. Link storage
php artisan storage:link

# 5. Create admin account
# Visit: http://localhost:8000/setup-admin
```

---

## 🏃 Daily Development

### Start All Services (Recommended)
```bash
composer dev
```
*Runs: Laravel server + Queue worker + Vite dev server*

### Manual Start (3 separate terminals)
```bash
# Terminal 1
php artisan serve

# Terminal 2
php artisan queue:work --tries=3

# Terminal 3
npm run dev
```

---

## 🗄️ Database Commands

```bash
# Fresh install (⚠️ DELETES ALL DATA)
php artisan migrate:fresh --seed

# Run migrations only
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Run seeders
php artisan db:seed
```

---

## 🧹 Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

## 📦 Rebuild Assets
```bash
# Development (hot reload)
npm run dev

# Production
npm run build

# Reinstall node modules
rm -rf node_modules package-lock.json
npm install
```

---

## 📧 Queue Commands
```bash
# Start queue worker
php artisan queue:work

# Listen (auto-restart)
php artisan queue:listen

# View failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

---

## 🐛 Troubleshooting
```bash
# Class not found
composer dump-autoload

# Reset .env
cp .env.example .env
php artisan key:generate

# Permission fix (Mac/Linux)
chmod -R 775 storage bootstrap/cache

# Different port
php artisan serve --port=8001
```

---

## 📊 Useful Info Commands
```bash
# List all routes
php artisan route:list

# List all artisan commands
php artisan list

# PHP version
php --version

# Composer version
composer --version

# Node version
node --version
```

---

## 🔒 Production Setup
```bash
# Build assets
npm run build

# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start queue in background
php artisan queue:listen &
```

---

**💡 Tip:** Bookmark this file for quick reference!
