# System Ticketing Dasaria

# Latar Belakang

    Sistem ticketing adalah alat yang digunakan untuk mengelola dan memantau tiket yang dibuat oleh pengguna. Sistem ini dapat digunakan untuk berbagai tujuan, seperti mengelola tiket masalah di perusahaan, mengelola tiket support di layanan pelanggan, atau mengelola tiket peminjaman di perpustakaan.

# Fitur Utama

    1. Login
    2. Register
    3. Dashboard
    4. Ticket
    5. Profile
    6. Setting

# Tech Stack

    Backend: Laravel 12
    Frontend: React 18
    Database: MySQL 8
    Server: PHP 8
    Socket: Express.js

# Arsitektur Singkat

    Project Menggunakan Pola Clean Architecture dengan pattern service repository untuk memisahkan logika bisnis dari controller.

    Contoh alur:
    Request -> Controller -> Service -> Repository -> Database -> Response

# Prasyarat Minimum

    1. PHP 8.1
    2. MySQL 8.0
    3. Node.js 16.0
    4. Composer
    
# Instalasi
    1. Clone repository
      ```bash
      git clone https://github.com/your-username/system-ticketing-dasaria.git
      ```

    2. Setup 

       **a. Backend (Laravel)**
          - Masuk ke direktori backend:
            ```bash
            cd Backend
            ```
          - Install dependencies:
            ```bash
            composer install
            ```
          - Setup Environment:
            Copy file `.env` dan generate key:
            ```bash
            cp .env.example .env
            php artisan key:generate
            ```
            > **PENTING**: Buka file `.env` dan sesuaikan konfigurasi database (DB_DATABASE, DB_USERNAME, DB_PASSWORD).

          - Setup Database & Migrations:
            Pastikan database `system_ticketing_dasaria` sudah dibuat, lalu jalankan:
            ```bash
            php artisan migrate:fresh --seed
            ```
          - Jalankan Server:
            ```bash
            php artisan serve
            ```

       **b. Frontend (React)**
          - Masuk ke direktori frontend (terminal baru):
            ```bash
            cd Frontend
            ```
          - Install dependencies:
            ```bash
            npm install
            ```
          - Setup Environment:
            ```bash
            cp .env.example .env
            ```
          - Jalankan Aplikasi:
            ```bash
            npm run dev
            ```

       **c. Socket Server**
          - Masuk ke direktori socket (terminal baru):
            ```bash
            cd Socket
            ```
          - Install dependencies:
            ```bash
            npm install
            ```
          - Setup Environment:
            ```bash
            cp .env.example .env
            ```
          - Jalankan Server:
            ```bash
            npm run dev
            ```
