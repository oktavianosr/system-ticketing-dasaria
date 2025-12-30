<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Comment;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agents = User::where('role', 'agent')->get();
        $customers = User::where('role', 'customer')->get();

        $scenarios = [
            ['title' => 'Internet Mati (Lampu LOS Merah)', 'desc' => 'Sudah 2 jam lampu LOS di modem berkedip merah.'],
            ['title' => 'Koneksi Lambat saat Hujan', 'desc' => 'Setiap hujan deras, speed drop dari 50Mbps ke 2Mbps.'],
            ['title' => 'Permintaan Upgrade Paket', 'desc' => 'Ingin upgrade dari paket 20Mbps ke 100Mbps.'],
            ['title' => 'Router Sering Restart Sendiri', 'desc' => 'Modem panas dan sering mati sendiri tiap 30 menit.'],
            ['title' => 'Tagihan Tidak Sesuai', 'desc' => 'Bulan ini tagihan saya dobel, mohon dicek.'],
            ['title' => 'Ganti Password Wifi', 'desc' => 'Saya lupa cara ganti password wifi lewat dashboard.'],
            ['title' => 'Relokasi Titik Pasang', 'desc' => 'Mau pindah posisi router dari lantai 1 ke lantai 2.'],
            ['title' => 'Wifi Tidak Jangkau Kamar', 'desc' => 'Sinyal di kamar belakang sangat lemah.'],
            ['title' => 'Streaming Netflix Buffering', 'desc' => 'Akses ke Netflix sangat lambat padahal YouTube lancar.'],
            ['title' => 'IP Public Dynamic', 'desc' => 'Apakah saya bisa minta IP Public statis untuk CCTV?'],
            ['title' => 'Lupa No Pelanggan', 'desc' => 'Mau bayar tapi lupa nomor ID pelanggannya.'],
            ['title' => 'Pendaftaran Akun Self-Care', 'desc' => 'Gagal registrasi di aplikasi mobile ISP.'],
            ['title' => 'Kabel Putus Terkena Pohon', 'desc' => 'Ada kabel di depan rumah putus tertimpa dahan.'],
            ['title' => 'Gaming Latency Tinggi', 'desc' => 'Main Mobile Legends ping naik turun (spike).'],
            ['title' => 'Gangguan Massal Area Jatim', 'desc' => 'Apakah di Surabaya sedang ada gangguan massal?'],
        ];

        $statuses = ['open', 'in_progress', 'resolved', 'closed'];
        $priorities = ['low', 'medium', 'high'];
        foreach ($scenarios as $index => $s) {
            $customer = $customers->random();
            $agent = $agents->random();
            $randomStatus = collect($statuses)->random();
            $randomPriority = collect($priorities)->random();


            // 1. Buat Tiket
            $ticket = Ticket::create([
                'code' => 'TIC-' . (1000 + $index),
                'title' => $s['title'],
                'description' => $s['desc'],
                'status' => $randomStatus,
                'priority' => $randomPriority,
                'created_by' => $customer->id,
                'assigned_to' => $agent->id,
            ]);

            // 2. Buat Alur 20 Komentar
            $conversationFlow = [
                "Halo, mohon dibantu kendala saya.",
                "Baik Bapak/Ibu, mohon maaf atas ketidaknyamanannya. Boleh dibantu nomor pelanggan?",
                "Nomor ID saya: " . rand(100000, 999999),
                "Terima kasih, sedang saya lakukan pengecekan dari sistem kami.",
                "Berapa lama ya proses pengecekannya?",
                "Mohon tunggu 5-10 menit, kami sedang koordinasi dengan tim NOC.",
                "Oke saya tunggu, tolong segera karena saya sedang meeting online.",
                "Hasil pengecekan kami menunjukkan ada redaman tinggi di jalur kabel Anda.",
                "Lalu solusinya bagaimana?",
                "Kami perlu mengirimkan teknisi ke lokasi untuk pengecekan fisik kabel.",
                "Kapan teknisi bisa datang?",
                "Tersedia jadwal besok pagi jam 10:00, apakah Bapak/Ibu bersedia?",
                "Bisa pagi ini tidak? Saya butuh sekali internetnya.",
                "Kami usahakan cari jadwal darurat, mohon ditunggu sebentar.",
                "Kabar baik, ada teknisi yang selesai lebih awal, mereka menuju lokasi sekarang.",
                "Alhamdulillah, terima kasih banyak bantuannya.",
                "Teknisi sudah sampai di lokasi? Mohon pastikan kabel di rumah aman.",
                "Sudah sampai, mereka sedang mengecek tiang di depan rumah.",
                "Kabel sudah disambung ulang, silakan dicoba kembali modemnya.",
                "Sudah lancar kembali! Terima kasih tim ISP atas respon cepatnya."
            ];

            foreach ($conversationFlow as $step => $text) {
                Comment::create([
                    'ticket_id' => $ticket->id,
                    'created_by' => ($step % 2 == 0) ? $customer->id : $agent->id, // Selang-seling Customer & Agent
                    'body' => $text,
                    'created_at' => now()->subHours(20)->addMinutes($step * 10),
                ]);
            }
        }
    }
}