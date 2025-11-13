#!/bin/bash
set -e

echo "==> Starting container..."

echo "==> Running Laravel migrations..."
php artisan migrate --force || echo "Migration failed, continuing..."

echo "==> Creating storage link..."
php artisan storage:link 2>/dev/null || echo "Storage link exists or failed, continuing..."

echo "==> Clearing Laravel cache..."
php artisan config:clear
php artisan cache:clear

echo "==> Optimizing Laravel..."
php artisan config:cache
php artisan route:cache

echo "==> Starting supervisor (PHP-FPM, Nginx, Queue Worker)..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
