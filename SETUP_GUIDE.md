# 🚀 Project Setup Guide
**Library Book Borrowing and Inventory System**

This guide will help you set up and run this project on a new device.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your new device:

### Required Software

1. **PHP 8.2 or higher**
   - Windows: Download from [php.net](https://windows.php.net/download/)
   - Mac: `brew install php@8.2`
   - Linux: `sudo apt install php8.2`

2. **Composer** (PHP package manager)
   - Download from [getcomposer.org](https://getcomposer.org/download/)
   - Verify: `composer --version`

3. **Node.js 18+ and npm**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

4. **Git** (optional, for version control)
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify: `git --version`

### Required PHP Extensions
Make sure these extensions are enabled in your `php.ini`:
- `pdo_sqlite` or `pdo_mysql`
- `mbstring`
- `openssl`
- `fileinfo`
- `curl`
- `zip`
- `xml`

---

## 📦 Installation Steps

### Step 1: Copy the Project
Transfer the entire project folder to your new device.

### Step 2: Navigate to Project Directory
```bash
cd path/to/Library-App
```

### Step 3: Install Dependencies
Run the automated setup command:
```bash
composer setup
```

**This command will:**
- Install all PHP dependencies (`composer install`)
- Copy `.env.example` to `.env`
- Generate application key
- Run database migrations
- Install all Node.js dependencies (`npm install`)
- Build frontend assets (`npm run build`)

### Step 4: Configure Environment Variables
Open the `.env` file and update the following:

#### Database Configuration
**For SQLite (Default - Recommended for development):**
```env
DB_CONNECTION=sqlite
DB_DATABASE=C:/path/to/Library-App/database/database.sqlite
```
Make sure the `database.sqlite` file exists. If not, create it:
```bash
# Windows
type nul > database/database.sqlite

# Mac/Linux
touch database/database.sqlite
```

**For MySQL:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=library_system
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Mail Configuration (for email reminders)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

#### Queue Configuration
```env
QUEUE_CONNECTION=database
```

### Step 5: Run Migrations (if not done automatically)
If migrations didn't run during setup, run manually:
```bash
php artisan migrate
```

**Optional: Seed with sample data**
```bash
php artisan db:seed
```

**Or fresh install with seeding:**
```bash
php artisan migrate:fresh --seed
```

### Step 6: Link Storage (for file uploads)
```bash
php artisan storage:link
```

### Step 7: Create Admin Account
Visit the setup route to create your first admin account:
```
http://localhost:8000/setup-admin
```

---

## 🏃 Running the Application

### Option 1: Quick Start (Recommended)
Run all services with one command:
```bash
composer dev
```

**This starts:**
- Laravel server at `http://localhost:8000`
- Queue worker (for email scheduling)
- Vite dev server (for hot module replacement)

### Option 2: Manual Start
Run each service in separate terminals:

**Terminal 1: Laravel Server**
```bash
php artisan serve
```

**Terminal 2: Queue Worker**
```bash
php artisan queue:work --tries=3
```
*Required for email reminders and background jobs*

**Terminal 3: Vite Dev Server**
```bash
npm run dev
```

### Option 3: Production Build
For production deployment:
```bash
# Build frontend assets
npm run build

# Start Laravel server
php artisan serve

# Start queue worker (in background)
php artisan queue:listen
```

---

## 🔧 Common Commands

### Development
```bash
# Start all dev servers
composer dev

# Run tests
composer test

# Clear application cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Fresh database reset (DEVELOPMENT ONLY)
php artisan migrate:fresh --seed
```

### Database
```bash
# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Reset and re-run all migrations
php artisan migrate:fresh

# Reset and seed
php artisan migrate:fresh --seed

# Run seeders only
php artisan db:seed
```

### Queue Management
```bash
# Start queue worker
php artisan queue:work

# Listen for queue jobs (auto-restart)
php artisan queue:listen

# View failed jobs
php artisan queue:failed

# Retry all failed jobs
php artisan queue:retry all
```

### Frontend
```bash
# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Run Electron app
npm run electron
```

---

## 🗂️ Project Access

After setup, access the application at:
- **Frontend**: `http://localhost:8000`
- **Welcome Page**: `http://localhost:8000/`
- **Login**: `http://localhost:8000/login`
- **Admin Setup**: `http://localhost:8000/setup-admin`

### Default Login (if using seeders)
Check your database seeders for default credentials, or create an admin via `/setup-admin`.

---

## 🐛 Troubleshooting

### Issue 1: "Class not found" errors
```bash
composer dump-autoload
```

### Issue 2: Permission errors (Mac/Linux)
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Issue 3: .env file not found
```bash
cp .env.example .env
php artisan key:generate
```

### Issue 4: Database connection errors
- Check `.env` database credentials
- Ensure database exists (for MySQL)
- For SQLite, ensure `database.sqlite` file exists

### Issue 5: Port already in use
```bash
# Use different port
php artisan serve --port=8001
```

### Issue 6: Vite not compiling assets
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue 7: Queue jobs not processing
- Ensure queue worker is running: `php artisan queue:work`
- Check `QUEUE_CONNECTION=database` in `.env`
- View failed jobs: `php artisan queue:failed`

---

## 📁 Important Files to Check

Before running, verify these files exist:
- ✅ `.env` (environment configuration)
- ✅ `database/database.sqlite` (if using SQLite)
- ✅ `vendor/` (PHP dependencies - run `composer install` if missing)
- ✅ `node_modules/` (Node dependencies - run `npm install` if missing)
- ✅ `public/build/` (compiled assets - run `npm run build` if missing)

---

## 🔐 Security Notes

**Before deploying to production:**
1. Change `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false` in `.env`
3. Use strong `APP_KEY` (auto-generated)
4. Configure proper database credentials
5. Set up HTTPS/SSL certificates
6. Configure proper CORS settings
7. Set up supervisor for queue workers
8. Enable rate limiting and security headers

---

## 📞 Need Help?

If you encounter issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Verify all prerequisites are installed
4. Ensure all services are running
5. Review this guide step-by-step

---

## ✅ Quick Setup Checklist

Copy this project to a new device:
- [ ] Install PHP 8.2+
- [ ] Install Composer
- [ ] Install Node.js 18+
- [ ] Navigate to project directory
- [ ] Run `composer setup`
- [ ] Configure `.env` file
- [ ] Run `php artisan storage:link`
- [ ] Visit `/setup-admin` to create admin
- [ ] Run `composer dev` to start all services
- [ ] Access application at `http://localhost:8000`

---

**🎉 You're all set! Happy coding!**
