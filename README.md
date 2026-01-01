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


# 1️⃣ Backend Laravel
cd backend
composer install          # ← Install PHP dependencies
cp .env.example .env     # ← Copy environment
php artisan key:generate # ← Generate key

# 2️⃣ Membuat database
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

php artisan migrate:fresh --seed # ← Setup database
php artisan serve        # ← Start server ✅

# 3️⃣ Frontend React
cd ../Frontend
npm install
cp .env.example .env
npm run dev

# 4️⃣ Socket
cd ../Socket
npm install
cp .env.example .env
npm run dev

