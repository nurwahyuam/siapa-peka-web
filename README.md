#  SIAPA PEKA
### **Sistem Informasi Digital Pencegahan Perkawinan Anak**

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

**Pencegahan Perkawinan Anak • Pemantauan Data • Komunikasi Informasi Edukasi**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Laravel Version](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![React Version](https://img.shields.io/badge/React-19.x-red.svg)](https://react.com)
[![PHP Version](https://img.shields.io/badge/PHP-8.3+-777BB4.svg)](https://php.net)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-777BB4.svg)](https://php.net)
[![Status](https://img.shields.io/badge/Status-Active%20Development-green.svg)](https://github.com/pemprovinsi-jatim/siapa-peka)

</div>

---

##  Tentang Siapa Peka

<p align="justify">
<b>SIAPA PEKA</b> adalah sistem informasi digital terpadu yang dikembangkan khusus untuk <b>pencegahan perkawinan anak</b> di Provinsi Jawa Timur. Aplikasi ini berfungsi sebagai platform monitoring, analisis data, dan media Komunikasi Informasi Edukasi (KIE) yang komprehensif untuk mendukung program pencegahan perkawinan anak secara berkelanjutan.
</p>

---

##  Fitur Utama

<div align="center">
    <table style="width:100%; border:1px solid #555; border-collapse:collapse;">
<tr>
  <td style="width:50%; vertical-align:top; padding:15px; border-right:1px solid #555;">

  <h3>🗺️ Peta Interaktif Jawa Timur</h3>
  <ul>
    <li>Visualisasi data kabupaten/kota</li>
    <li>Pewarnaan tingkat kasus</li>
    <li>Perbesar dan geser interaktif</li>
  </ul>

  <h3>📊 Analisis Beranda</h3>
  <ul>
    <li>Pencegahan perkawinan anak</li>
    <li>Tren dispensasi kawin</li>
    <li>Progress berkelanjutan</li>
  </ul>

  </td>
  <td style="width:50%; vertical-align:top; padding:15px;">

  <h3>📈 Sistem Pelaporan Terpadu</h3>
  <ul>
    <li>Laporan Ringkasan</li>
    <li>Klasifikasi pendidikan</li>
    <li>Ekspor data berbagai format</li>
  </ul>

  <h3>👥 Survei & Forum Anak</h3>
  <ul>
    <li>Forum diskusi</li>
    <li>Umpan balik dari masyarakat</li>
    <li>Analisis hasil survei </li>
  </ul>

  </td>
</tr>
</table>
</div>


##  Langkah Instalasi

Ikuti langkah berikut untuk menjalankan projek:

---


```bash
# 1. Install Dependencies
composer install
npm install
# 2. Setup Environment
cp .env.example .env
# 3. Migrasi Database + Seeder & Import Data
php artisan migrate --seed
php artisan import:city-features
php artisan import:api-prov-jatim
php artisan db:seed --class=ForumChildrenSeeder
# 4. Optimisasi 
php artisan optimize:clear
php artisan storege:link
# 5. Jalankan Server
php artisan serve
npm run dev
```
---

##  Dokumentasi

<div align="center">

###  Beranda Peta 

![Dashboard Peta](public/assets/siapapeka.png)

</div>

---

##  Pencipta

-  **Haafiz Ghifari Rarian** - *UI/UX Designer*
-  **Farah Bianca** - *Front-end Developer*
-  **Natasya Hayudyo Murthiningtyas** - *Front-end Developer*
-  **Moch. Azriel Maulana R.** - *Fullstack Developer*
-  **Nurwahyu Akbar Maulidy** - *Fullstack Developer*


---

<div align="center">

###  **"SIAPA PEKA - Sistem Informasi Digital Pencegahan Perkawinan Anak"**

**Dikembangkan dengan hati untuk Pencegahan Perkawinan Anak**

[![Made in East Java](https://img.shields.io/badge/Made_with_love_in-East_Java-red.svg)](https://jatimprov.go.id)
[![Government Project](https://img.shields.io/badge/🏛️_Official-Government_Project-blue.svg)](https://siapa-peka.jatimprov.go.id)
[![Child Protection](https://img.shields.io/badge/_Child-Protection_Program-pink.svg)](https://www.unicef.org/indonesia/)

---

*© 2025 SIAPA PEKA - Pemerintah Provinsi Jawa Timur. Untuk masa depan anak yang lebih baik.*

**"Setiap anak berhak mendapatkan masa kecil yang bahagia dan pendidikan yang layak"**

</div>
