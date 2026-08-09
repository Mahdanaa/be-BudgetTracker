# Penjelasan Backend Setup Project "Budget Tracer"

Dokumen ini berisi penjelasan detail mengenai struktur, teknologi, dan cara kerja dari setup *backend* untuk project **Budget Tracer**. Saat ini, *source code* ini masih merupakan setup awal dan belum final.

---

## 1. Framework & Teknologi Utama yang Digunakan
Project ini dibangun menggunakan platform Node.js. Berikut adalah teknologi utama yang menopang *backend* ini:
- **Express.js (`express`)**: Merupakan framework web untuk Node.js yang berfungsi untuk membangun API dan menangani *routing* (HTTP requests).
- **Sequelize**: Object-Relational Mapper (ORM) berbasis *Promise* untuk Node.js. Digunakan untuk berinteraksi dengan database secara mudah menggunakan sintaks JavaScript (tanpa perlu menulis *query* SQL manual).
- **MySQL2**: Driver untuk menghubungkan *backend* Node.js dengan database MySQL.
- **Keamanan**: Menggunakan `helmet` untuk pengaturan *security headers* dan `cors` agar API dapat diakses dari *frontend/domain* yang diizinkan.
- **JWT (`jsonwebtoken`) & bcrypt**: Digunakan untuk fitur autentikasi (Login) dan hashing *password* pengguna.
- **Validasi**: Menggunakan `express-validator` dan `zod` untuk memvalidasi *request body* atau input yang masuk ke API.

---

## 2. Fitur-Fitur yang Ada dalam Setup Saat Ini
Dari struktur direktori (di folder `src/modules` dan `migrations`), terdapat kerangka untuk fitur-fitur berikut:
1. **Auth (`auth`)**: Mengurus registrasi dan login menggunakan JWT.
2. **User (`user`)**: Pengelolaan data pengguna aplikasi.
3. **Category (`category`)**: Fitur untuk mengelola kategori pemasukan/pengeluaran (misal: "Makan", "Transportasi", "Gaji").
4. **Transaction (`transaction`)**: Fitur inti untuk mencatat transaksi keuangan (pemasukan & pengeluaran).
5. **Monthly Summary (`monthlySummary`)**: Fitur untuk merekap/merangkum laporan keuangan per bulan berdasarkan riwayat transaksi pengguna.

---

## 3. Apa itu Sequelize dan Bagaimana Cara Kerjanya?
**Sequelize** adalah ORM (Object-Relational Mapper). Secara sederhana, ORM bertugas sebagai jembatan antara bahasa pemrograman (JavaScript) dengan Database Relasional (MySQL). 

**Cara Kerja Sequelize:**
Daripada Anda menulis *query* SQL mentah secara manual, misalnya:
`INSERT INTO users (name, email) VALUES ('Budi', 'budi@mail.com');`

Dengan Sequelize, Anda cukup menulis kode JavaScript (disebut **Model**):
`User.create({ name: 'Budi', email: 'budi@mail.com' });`

Sequelize akan membaca baris di atas, dan secara otomatis **mengonversinya** menjadi *query* SQL yang sesuai di belakang layar, mengeksekusinya ke database, dan mengembalikan hasilnya dalam bentuk objek JavaScript kembali.

Selain model, Sequelize juga memiliki fitur **Migrations**. Migrations ibarat *version control* (seperti Git) tetapi untuk struktur/skema database. Contohnya, file `20250522092604-create-monthly-summaries.js` berfungsi untuk mencatat instruksi cara membuat tabel di database secara konsisten di semua komputer *developer*.

---

## 4. Cara Kerja `async` dan `await` (Contoh pada file Migrations)
Dalam Node.js, operasi yang melibatkan akses database, pembacaan file, atau permintaan API selalu bersifat **Asynchronous (berjalan secara latar belakang/tidak langsung selesai)** agar aplikasi tidak hang (*blocking*).

Pada file migrations Anda (contoh saat membuat tabel), Anda menemukan struktur seperti ini:
```javascript
async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', { ... });
}
```

- **`async`**: Kata kunci yang diletakkan di depan sebuah fungsi. Ini menandakan bahwa di dalam fungsi ini akan ada proses asinkronus (proses yang membutuhkan waktu).
- **`await`**: Kata kunci ini **hanya bisa dipakai di dalam fungsi `async`**. Fungsinya adalah "menyuruh" JavaScript untuk berhenti (menunggu/pause) di baris tersebut sampai proses eksekusi database-nya **selesai**, baru lanjut mengeksekusi baris kode selanjutnya.

Jika tidak menggunakan `await`, JavaScript akan langsung lanjut membaca ke bawah sebelum tabel selesai dibuat di database. Hal itu bisa memicu *error* jika baris di bawahnya langsung mencoba memasukkan data ke tabel yang belum tercipta.

---

## 5. Alur dan Ketergantungan (Relasi) Antar File

Berikut adalah gambaran bagaimana file-file di *source code* ini saling memanggil dan bergantungan satu sama lain:

1. **`src/server.js` (Titik Awal)** 
   File ini adalah tempat aplikasi pertama kali dijalankan (dilihat dari `package.json -> scripts -> "dev": "nodemon ./src/server.js"`). Tugas utamanya hanya menjalankan server HTTP dan memanggil port tertentu.
2. **`src/app.js` (Otak Konfigurasi)** 
   Dipanggil/diimpor oleh `server.js`. Di sinilah Express diinisialisasi. File ini bertanggung jawab untuk:
   - Menghubungkan *middleware* (CORS, Helmet).
   - Memanggil koneksi database: `require('./store/sequelize')`.
   - Mengatur penanganan *Error* secara global (*Global Error Handler*).
   - Mendaftarkan rute (Routes) API.
3. **`src/store/sequelize` (Koneksi Database)**
   Bertugas menghubungkan kode dengan database MySQL secara langsung. Jika koneksi di sini gagal, maka seluruh operasi *query* yang menggunakan Sequelize tidak akan berjalan.
4. **`src/modules/` (Logika Bisnis)**
   Ini adalah folder per-fitur (User, Auth, Transaction). Biasanya di dalamnya ada ketergantungan seperti: `Routes` memanggil `Controller` -> `Controller` memanggil fungsi `Service` -> `Service` memanggil `Model/Repository` (berhubungan dengan database).
5. **`models/` & `migrations/`** 
   Bergantung pada konfigurasi koneksi yang ada di folder `config/config.json` (biasanya file konfigurasi Sequelize CLI yang mengambil kredensial database dari file `.env`).
