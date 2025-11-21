# 🔧 Troubleshooting Guide

Common issues and their solutions when setting up or running the Library Management System.

---

## 🚨 Installation Issues

### ❌ "composer: command not found"
**Problem:** Composer is not installed or not in PATH

**Solution:**
1. Download Composer from [getcomposer.org](https://getcomposer.org/download/)
2. Install globally
3. Restart your terminal
4. Verify: `composer --version`

---

### ❌ "php: command not found"
**Problem:** PHP is not installed or not in PATH

**Solution:**
- **Windows:** Download from [php.net](https://windows.php.net/download/) and add to PATH
- **Mac:** `brew install php@8.2`
- **Linux:** `sudo apt install php8.2`
- Verify: `php --version`

---

### ❌ "npm: command not found"
**Problem:** Node.js is not installed

**Solution:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Install LTS version
3. Restart terminal
4. Verify: `npm --version`

---

## 🗄️ Database Issues

### ❌ "SQLSTATE[HY000] [14] unable to open database file"
**Problem:** SQLite database file doesn't exist

**Solution:**
```bash
# Create the database file
# Windows
type nul > database/database.sqlite

# Mac/Linux
touch database/database.sqlite

# Then run migrations
php artisan migrate
```

---

### ❌ "SQLSTATE[HY000] [2002] Connection refused"
**Problem:** MySQL server is not running or wrong credentials

**Solution:**
1. Check if MySQL is running
2. Verify `.env` credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=library_system
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
3. Create database: `CREATE DATABASE library_system;`
4. Clear config: `php artisan config:clear`

---

### ❌ "Nothing to migrate"
**Problem:** Migrations already run or database issue

**Solution:**
```bash
# Check migration status
php artisan migrate:status

# Fresh install (⚠️ deletes all data)
php artisan migrate:fresh --seed

# Or rollback and re-run
php artisan migrate:rollback
php artisan migrate
```

---

## 🔑 Environment Issues

### ❌ "No application encryption key has been specified"
**Problem:** APP_KEY is missing in .env

**Solution:**
```bash
# Generate new key
php artisan key:generate

# Clear config cache
php artisan config:clear
```

---

### ❌ ".env file not found"
**Problem:** Environment file is missing

**Solution:**
```bash
# Copy from example
cp .env.example .env

# Generate key
php artisan key:generate

# Configure your database and other settings
# Edit .env manually
```

---

## 📦 Dependency Issues

### ❌ "Class '...' not found"
**Problem:** Autoloader needs to be regenerated

**Solution:**
```bash
composer dump-autoload
php artisan clear-compiled
php artisan config:clear
```

---

### ❌ "vendor directory not found"
**Problem:** Dependencies not installed

**Solution:**
```bash
composer install
```

---

### ❌ "node_modules not found"
**Problem:** Node dependencies not installed

**Solution:**
```bash
npm install

# If issues persist
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 Frontend/Asset Issues

### ❌ "Vite manifest not found"
**Problem:** Assets not compiled

**Solution:**
```bash
# Build assets
npm run build

# Or run dev server
npm run dev
```

---

### ❌ "Failed to resolve module"
**Problem:** Missing npm dependencies or path issues

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

### ❌ Styles not loading
**Problem:** Tailwind CSS not compiling

**Solution:**
```bash
# Check tailwind.config.js exists
# Rebuild assets
npm run dev

# If using production build
npm run build
```

---

## 🔐 Permission Issues

### ❌ "Permission denied" on storage or cache
**Problem:** Directory permissions (Mac/Linux)

**Solution:**
```bash
# Fix permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# If running as www-data
sudo chown -R www-data:www-data storage
sudo chown -R www-data:www-data bootstrap/cache
```

**Windows:** Usually not an issue, but ensure you're not running from a protected directory.

---

### ❌ "The stream or file could not be opened"
**Problem:** Log file permission issue

**Solution:**
```bash
# Mac/Linux
chmod -R 775 storage/logs

# Windows - run as administrator or check folder permissions
```

---

## 🌐 Server Issues

### ❌ "Address already in use"
**Problem:** Port 8000 is already in use

**Solution:**
```bash
# Use different port
php artisan serve --port=8001

# Or kill the process using port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Mac/Linux
lsof -ti:8000 | xargs kill
```

---

### ❌ 404 on all routes except "/"
**Problem:** .htaccess not working or mod_rewrite disabled

**Solution:**
```bash
# Ensure public/index.php is entry point
# For Apache, enable mod_rewrite
# For nginx, configure properly

# Development: just use artisan serve
php artisan serve
```

---

## 📧 Email/Queue Issues

### ❌ Emails not sending
**Problem:** Queue worker not running or mail config wrong

**Solution:**
```bash
# Start queue worker
php artisan queue:work

# Check failed jobs
php artisan queue:failed

# Verify .env mail settings
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
# ... etc

# Clear config
php artisan config:clear
```

---

### ❌ "Queue connection not found"
**Problem:** QUEUE_CONNECTION in .env is wrong

**Solution:**
```env
# In .env, set to database
QUEUE_CONNECTION=database

# Then
php artisan config:clear
php artisan queue:work
```

---

## 🖼️ File Upload Issues

### ❌ "The file could not be uploaded"
**Problem:** Storage link not created

**Solution:**
```bash
php artisan storage:link

# Verify symbolic link created
# Check: public/storage -> storage/app/public exists
```

---

### ❌ Uploaded images not showing
**Problem:** Storage path or permissions

**Solution:**
```bash
# Link storage
php artisan storage:link

# Check permissions
chmod -R 775 storage/app/public

# Verify files are in storage/app/public
```

---

## 🔄 Cache Issues

### ❌ Changes not reflecting
**Problem:** Configuration/route/view cached

**Solution:**
```bash
# Clear everything
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan clear-compiled

# Restart queue worker if running
# Ctrl+C then restart: php artisan queue:work
```

---

## 🧪 Testing Issues

### ❌ Tests failing
**Problem:** Test database or environment

**Solution:**
```bash
# Use separate test database
# Create .env.testing

# Clear test cache
php artisan config:clear --env=testing

# Run tests
php artisan test
```

---

## 💻 Windows-Specific Issues

### ❌ Long path errors
**Problem:** Windows path length limit

**Solution:**
1. Enable long paths in Windows
2. Or move project closer to root: `C:\Projects\Library-App`

---

### ❌ Symlink issues (storage:link)
**Problem:** Windows requires admin for symlinks

**Solution:**
```bash
# Run terminal as Administrator
# Then run:
php artisan storage:link
```

---

## 🍎 Mac-Specific Issues

### ❌ "Operation not permitted"
**Problem:** Mac security restrictions

**Solution:**
- Grant Terminal full disk access in System Preferences → Security & Privacy
- Or move project to Documents/Desktop where you have full access

---

## 🐧 Linux-Specific Issues

### ❌ Apache/Nginx not serving app
**Problem:** Web server configuration

**Solution:**
```bash
# For development, just use:
php artisan serve

# For production, configure virtual host properly
# Point document root to: /path/to/project/public
```

---

## 🆘 General Debugging

### Enable Debug Mode
```env
# In .env
APP_DEBUG=true
APP_ENV=local
```

### Check Laravel Logs
```bash
# View logs
tail -f storage/logs/laravel.log

# Windows
Get-Content storage/logs/laravel.log -Tail 50 -Wait
```

### Check PHP Info
```bash
php -i
# Or create phpinfo.php in public/ with:
<?php phpinfo();
```

---

## 🔍 Still Having Issues?

1. **Check Laravel logs:** `storage/logs/laravel.log`
2. **Check browser console:** F12 → Console tab
3. **Verify all prerequisites:** PHP, Composer, Node.js versions
4. **Try fresh install:**
   ```bash
   rm -rf vendor node_modules
   composer install
   npm install
   php artisan migrate:fresh --seed
   ```
5. **Search Laravel documentation:** [laravel.com/docs](https://laravel.com/docs)
6. **Check Inertia documentation:** [inertiajs.com](https://inertiajs.com/)

---

**💡 Pro Tip:** When asking for help, always include:
- Error message (full stack trace)
- PHP version (`php --version`)
- Laravel version
- What you were trying to do
- What you've already tried

---

**🎯 Quick Fix Checklist:**
- [ ] `.env` file exists and configured
- [ ] `composer install` completed
- [ ] `npm install` completed
- [ ] Database file exists (SQLite) or MySQL running
- [ ] `php artisan migrate` completed
- [ ] `php artisan storage:link` completed
- [ ] `npm run build` or `npm run dev` completed
- [ ] Queue worker running (for emails)
- [ ] All services running (`composer dev`)
