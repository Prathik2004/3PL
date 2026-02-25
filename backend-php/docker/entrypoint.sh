#!/bin/sh
set -e

# Run migrations if necessary
# php artisan migrate --force

# Start PHP-FPM
php-fpm

