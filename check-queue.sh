#!/bin/bash

echo "==================================="
echo "Queue Diagnostics"
echo "==================================="

echo ""
echo "1. Database Connection:"
php artisan db:show || echo "Failed to show database info"

echo ""
echo "2. Queue Configuration:"
php artisan config:show queue.default
php artisan config:show queue.connections.database

echo ""
echo "3. Jobs in Queue:"
php artisan queue:monitor database || echo "No monitoring available"

echo ""
echo "4. Failed Jobs:"
php artisan queue:failed

echo ""
echo "5. Jobs Table Count:"
php artisan tinker --execute="echo 'Jobs: ' . DB::table('jobs')->count(); echo PHP_EOL;"

echo ""
echo "6. Check Delayed Jobs:"
php artisan tinker --execute="DB::table('jobs')->select('id', 'queue', 'attempts', 'available_at', 'created_at')->orderBy('id', 'desc')->limit(5)->get()->each(function(\$job) { echo 'Job ID: ' . \$job->id . ', Queue: ' . \$job->queue . ', Available at: ' . date('Y-m-d H:i:s', \$job->available_at) . PHP_EOL; });"

echo ""
echo "7. Mail Configuration:"
php artisan config:show mail.default
php artisan config:show mail.from.address

echo ""
echo "==================================="
echo "End Diagnostics"
echo "==================================="
