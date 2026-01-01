# check apakah sudah terinstall
php --version        # php 8.1++
composer --version   # Composer 2.x
node --version       # Node.js 22+ required
npm --version        # NPM 10.+
mysql --version      # MySQL 8+ atau MariaDB

# Jika belum install, download dari:
# PHP: https://www.php.net/downloads
# Composer: https://getcomposer.org/
# Node.js: https://nodejs.org/
# MySQL: https://dev.mysql.com/downloads/


# STEP 1 install semua package php via 
cd Backend
composer install

# STEP 2 konfigurasi file .env
cp .env.example .env

# STEP 3 generate key 
php artisan key:generate

# STEP 4 membuat database bebas via cli atau phpmyadmin
Opsi A: Via CLI
mysql -u root -p (jika via cli)
CREATE DATABASE system_ticketing_dasaria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

Opsi B: Via phpMyAdmin

Buka http://localhost/phpmyadmin
Klik "New" di sidebar kiri
Nama Database: system_ticketing_dasaria
Collation: utf8mb4_unicode_ci
Klik "Create"

# STEP 5 migrate & seed database 
php artisan migrate:fresh --seed

# STEP 6 start server di port 8000
php artisan serve