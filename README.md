# KofKof 😷

**KofKof** adalah aplikasi web berbasis Vue 3 yang menganalisis "tanda tangan akustik" (*acoustic signature*) batuk Anda untuk membantu mengidentifikasi jenisnya (contoh: batuk kering, batuk berdahak, dll).

Aplikasi ini dirancang untuk membantu pengguna memahami gejala mereka dengan lebih baik sebelum berkonsultasi dengan profesional medis.

![KofKof Banner](public/logo.png)

## ✨ Fitur Utama

* **Analisis Suara Batuk:** Merekam dan menganalisis suara batuk menggunakan mikrofon perangkat.
* **Visualizer Audio:** Menampilkan gelombang suara secara *real-time* selama perekaman.
* **Privasi Diutamakan:** Tidak ada rekaman atau hasil yang disimpan di server.
* **Antarmuka Responsif:** Dibangun menggunakan Tailwind CSS untuk tampilan yang rapi di desktop dan seluler.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi web modern:

* [Vue 3](https://vuejs.org/) - Framework JavaScript progresif.
* [Vite](https://vitejs.dev/) - *Build tool* yang cepat.
* [Tailwind CSS](https://tailwindcss.com/) - Framework CSS *utility-first*.
* [Axios](https://axios-http.com/) - Untuk memanggil API ke backend.
* [Vitest](https://vitest.dev/) - Pengujian unit (*Unit testing*).

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut:

* **Node.js**: Versi `^20.19.0` atau `>=22.12.0` (sesuai yang tertera di `package.json`).
* **NPM**: Biasanya sudah terinstal bersama Node.js.

## 🚀 Instalasi & Penggunaan

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal Anda:

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/iniFaiz/KofKof.git](https://github.com/iniFaiz/KofKof.git)
    cd KofKof
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Atur Variabel Lingkungan (Environment Variables):**
    Buat file `.env` di root proyek dan masukkan URL backend Anda (jika ada):
    ```env
    VITE_API_URL=http://localhost:3000
    ```

4.  **Jalankan server pengembangan (Development Server):**
    ```bash
    npm run dev
    ```
    Buka tautan yang muncul di terminal (biasanya `http://localhost:5173`).

5.  **Build untuk Produksi:**
    ```bash
    npm run build
    ```

## 🧪 Menjalankan Pengujian

Untuk menjalankan pengujian unit (*Unit Tests*):

```bash
npm run test
