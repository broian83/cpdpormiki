Buatkan aplikasi web app / PWA production-ready untuk sistem Member Area PMIK dan Dashboard Admin PMIK, dengan frontend di-deploy ke Netlify dan backend menggunakan Supabase.

Konteks aplikasi:
Aplikasi ini adalah portal digital untuk profesional PMIK di Indonesia. Sistem terdiri dari 2 sisi utama:
1. Portal member area untuk anggota PMIK
2. Dashboard admin untuk pengelolaan anggota, logbook, pembayaran, LMS, pesan, dan laporan

Aplikasi harus:
- Berbahasa Indonesia
- Mobile-first
- Responsif untuk desktop, tablet, dan mobile
- Bisa dipasang sebagai PWA
- Modern, clean, profesional, ringan, dan scalable
- Siap dikembangkan untuk sekitar 10.000 member

Stack teknologi wajib:
- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- React Query
- Zustand atau Context API
- React Hook Form
- Zod
- TanStack Table
- Recharts atau Chart.js
- jsPDF atau pdf-lib
- PWA support
- Deploy frontend ke Netlify

Kebutuhan non-fungsional:
- Aman dan scalable untuk sekitar 10.000 member
- Gunakan Row Level Security (RLS)
- Gunakan role-based access control
- Gunakan protected routes
- Gunakan pagination, filtering, dan search
- Gunakan environment variables
- Optimasi performa mobile
- Gunakan clean architecture modular
- Siap deployment di Netlify
- Database dan file storage di Supabase

==================================================
A. PORTAL MEMBER AREA PMIK
==================================================

Menu member area:
1. Dashboard
2. Private Area
3. Mailbox / Pesan
4. Help / Bantuan
5. Profil PMIK
6. Account Settings
7. Curriculum Vitae
8. Pembayaran Iuran
9. Kegiatan LMS
10. Logbook PMIK

Navigasi mobile:
- Dashboard
- Logbook PMIK
- Pesan
- LMS
- Profil

Navigasi sidebar / drawer:
- Dashboard
- Private Area
- Account Settings
- Curriculum Vitae
- Pembayaran Iuran
- Help
- Logout

Fitur member:
1. Login / autentikasi member
2. Dashboard ringkasan
3. Private Area
4. Profil PMIK
5. Curriculum Vitae
6. Mailbox / pesan internal
7. Help center / FAQ
8. Pembayaran iuran
9. Kegiatan LMS
10. Logbook PMIK
11. Rekap logbook 6 bulan
12. Rekap logbook 12 bulan
13. Export PDF laporan
14. PWA installable
15. Responsive desktop + mobile

Modul utama member: Logbook PMIK

Submenu Logbook PMIK:
- Petunjuk Pengisian Logbook PMIK
- Input Logbook Bulanan
- Daftar Entri Logbook
- Rekap 6 Bulan
- Rekap 12 Bulan
- Cetak / Export Laporan

Fungsi Logbook PMIK:
- Mencatat pekerjaan/kegiatan bulanan PMIK
- Setiap member dapat menginput beberapa jenis kegiatan dalam satu bulan
- Setiap jenis kegiatan memiliki jumlah kegiatan
- Data dapat ditambah, diubah, dihapus
- Data dapat dicari dan difilter
- Sistem membuat rekap otomatis 6 bulan atau 12 bulan
- Rekap berbentuk matriks
- Baris = jenis kegiatan
- Kolom = bulan
- Kolom terakhir = total
- Hasil dapat diexport ke PDF

Format input logbook:
- Tahun
- Bulan
- Jenis Kegiatan
- Jumlah Kegiatan
- Keterangan opsional

Contoh input:
- Tahun: 2026
- Bulan: 1
- Jenis Kegiatan: Coding diagnosis
- Jumlah Kegiatan: 125
- Keterangan: Rawat inap dan rawat jalan

Master jenis kegiatan PMIK default:
- Pendaftaran pasien
- Assembling rekam medis
- Analisis kuantitatif rekam medis
- Coding diagnosis
- Coding tindakan
- Indexing
- Filing
- Retensi arsip rekam medis
- Distribusi dokumen rekam medis
- Monitoring kelengkapan rekam medis
- Pelaporan statistik rumah sakit
- Verifikasi klaim/BPJS
- Audit mutu rekam medis
- Edukasi/sosialisasi unit
- Rapat/koordinasi
- Pengelolaan RME
- Validasi data pasien
- Penyisiran berkas pending
- Quality control dokumen rekam medis

Format rekap laporan:
Mode 12 bulan:
                                 Bulan
Jenis Kegiatan | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | Total

Mode 6 bulan:
                                 Bulan
Jenis Kegiatan | 1 | 2 | 3 | 4 | 5 | 6 | Total

Footer laporan:
Jakarta, [tanggal dicetak] / [bulan] / [tahun]

[Nama PMIK]

Aturan rekap:
- Jika suatu bulan tidak ada data, tampilkan 0
- Nama PMIK diambil dari profil user
- Kota default footer adalah Jakarta
- Tanggal cetak otomatis
- Total dihitung otomatis
- Rekap dapat difilter berdasarkan tahun
- Rekap 6 bulan bisa memilih semester 1 atau semester 2
- Rekap tampil rapi di web dan PDF

Halaman member yang harus dibuat:
1. Login Page
2. Forgot Password Page
3. Dashboard Page
4. Private Area Page
5. Profil PMIK Page
6. Account Settings Page
7. Curriculum Vitae Page
8. Mailbox List Page
9. Message Detail Page
10. Help Center Page
11. Pembayaran Iuran Page
12. Riwayat Pembayaran Page
13. Kegiatan LMS Page
14. LMS Detail Page
15. LMS Progress Page
16. Logbook PMIK Home Page
17. Input Logbook Bulanan Page
18. Edit Logbook Page
19. Daftar Entri Logbook Page
20. Rekap 6 Bulan Page
21. Rekap 12 Bulan Page
22. Detail Rekap Page
23. Export PDF Page
24. Not Found Page
25. Unauthorized Page
26. Offline Fallback Page

Widget Dashboard member:
- Ringkasan profil PMIK
- Jumlah entri logbook bulan berjalan
- Total kegiatan bulan berjalan
- Pesan belum dibaca
- Tagihan belum dibayar
- Course LMS aktif
- Shortcut ke Input Logbook
- Shortcut ke Rekap Logbook
- Shortcut ke Pembayaran Iuran

==================================================
B. DASHBOARD ADMIN PMIK
==================================================

Role admin:
- super_admin
- admin_pusat
- admin_cabang
- verifier
- finance_admin
- lms_admin

Menu dashboard admin:
1. Dashboard
2. Manajemen Member
3. Profil PMIK
4. Logbook PMIK
5. Rekap Logbook
6. Pembayaran Iuran
7. Mailbox
8. Kegiatan LMS
9. Help Center
10. Master Jenis Kegiatan
11. Laporan
12. Pengaturan Admin

Fitur dashboard admin:
1. Login admin
2. Dashboard KPI
3. Manajemen member
4. Monitoring logbook PMIK
5. Rekap aktivitas PMIK
6. Manajemen pembayaran iuran
7. Manajemen mailbox
8. Manajemen LMS
9. CRUD help article
10. CRUD master jenis kegiatan
11. Export laporan
12. Audit trail aktivitas admin

Widget dashboard admin:
- Total member aktif
- Total member nonaktif
- Total logbook bulan ini
- Total jumlah kegiatan bulan ini
- Total tagihan belum dibayar
- Total transaksi berhasil
- Total pesan belum dibaca
- Total course aktif
- Grafik aktivitas logbook per bulan
- Grafik distribusi jenis kegiatan
- Grafik pembayaran iuran
- Aktivitas terbaru
- Notifikasi item yang perlu ditindaklanjuti

Fitur manajemen member:
- List member dengan pagination
- Search member
- Filter berdasarkan status akun, unit kerja, jabatan, wilayah/cabang
- Detail member
- Edit profil member
- Aktivasi / nonaktifkan akun
- Reset password
- Lihat histori aktivitas member

Fitur Logbook PMIK admin:
- List seluruh entri logbook
- Filter berdasarkan tahun, bulan, jenis kegiatan, member, unit kerja
- Lihat detail logbook member
- Edit/koreksi entri sesuai hak akses
- Export rekap logbook
- Monitoring member yang belum input logbook
- Monitoring member paling aktif
- Statistik jumlah kegiatan per kategori

Fitur master jenis kegiatan:
- Tambah jenis kegiatan
- Edit jenis kegiatan
- Nonaktifkan jenis kegiatan
- Atur urutan tampilan
- Import/export master kegiatan

Fitur pembayaran iuran:
- List invoice
- Filter status pembayaran
- Lihat detail transaksi
- Verifikasi pembayaran
- Rekap pembayaran per periode
- Statistik pembayaran

Fitur LMS admin:
- List course
- Tambah/edit course
- Kelola modul
- Monitoring enrollment
- Monitoring progress peserta

Fitur mailbox admin:
- Broadcast pesan ke semua member atau member tertentu
- Inbox admin
- Detail pesan
- Status baca pesan

Fitur help center admin:
- CRUD artikel bantuan
- Kategori bantuan
- Publish/unpublish artikel

Fitur laporan admin:
- Rekap logbook 6 bulan
- Rekap logbook 12 bulan
- Rekap pembayaran iuran
- Rekap aktivitas member
- Export PDF/Excel/CSV

Halaman admin yang harus dibuat:
1. Admin Login Page
2. Admin Dashboard Page
3. Member List Page
4. Member Detail Page
5. Edit Member Page
6. Logbook Monitoring Page
7. Logbook Detail Page
8. Rekap Logbook Page
9. Payment Dashboard Page
10. Payment Detail Page
11. LMS Dashboard Page
12. Course List Page
13. Course Detail Page
14. Help Article List Page
15. Help Article Editor Page
16. Mailbox Admin Page
17. Broadcast Message Page
18. Master Jenis Kegiatan Page
19. Laporan Page
20. Admin Settings Page

==================================================
C. DATABASE SUPABASE POSTGRESQL
==================================================

Buat SQL schema lengkap CREATE TABLE untuk tabel berikut:

1. users
- id uuid primary key
- email varchar unique not null
- password_hash varchar null
- role varchar default 'member'
- status_akun varchar default 'active'
- last_login timestamp null
- created_at timestamp default now()

2. pmik_profiles
- id uuid primary key
- user_id uuid references users(id)
- nama_pmik varchar not null
- nomor_anggota varchar unique null
- nik varchar null
- unit_kerja varchar null
- jabatan varchar null
- cabang varchar null
- kota_cetak_default varchar default 'Jakarta'
- foto_url text null
- created_at timestamp default now()
- updated_at timestamp default now()

3. account_settings
- id uuid primary key
- user_id uuid references users(id)
- notif_email boolean default true
- notif_push boolean default true
- bahasa varchar default 'id'
- tema varchar default 'light'
- updated_at timestamp default now()

4. cvs
- id uuid primary key
- user_id uuid references users(id)
- ringkasan text null
- pendidikan text null
- pengalaman_kerja text null
- sertifikasi text null
- organisasi text null
- updated_at timestamp default now()

5. messages
- id uuid primary key
- sender_id uuid references users(id)
- receiver_id uuid references users(id)
- subject varchar not null
- body text not null
- is_read boolean default false
- sent_at timestamp default now()
- read_at timestamp null

6. help_articles
- id uuid primary key
- judul varchar not null
- slug varchar unique not null
- isi text not null
- kategori varchar null
- is_published boolean default true
- updated_at timestamp default now()

7. payment_invoices
- id uuid primary key
- user_id uuid references users(id)
- invoice_no varchar unique not null
- jenis_iuran varchar not null
- periode varchar not null
- nominal numeric(12,2) not null
- status varchar default 'unpaid'
- due_date date null
- paid_at timestamp null
- created_at timestamp default now()

8. payment_transactions
- id uuid primary key
- invoice_id uuid references payment_invoices(id)
- payment_method varchar null
- reference_no varchar null
- amount numeric(12,2) not null
- payment_gateway_response jsonb null
- status varchar default 'pending'
- created_at timestamp default now()

9. lms_courses
- id uuid primary key
- judul varchar not null
- kategori varchar null
- deskripsi text null
- thumbnail_url text null
- status_publish boolean default true
- created_at timestamp default now()

10. lms_modules
- id uuid primary key
- course_id uuid references lms_courses(id)
- judul_modul varchar not null
- urutan integer not null
- tipe_konten varchar not null
- konten_url text null
- created_at timestamp default now()

11. lms_enrollments
- id uuid primary key
- user_id uuid references users(id)
- course_id uuid references lms_courses(id)
- enrolled_at timestamp default now()
- progress_percent numeric(5,2) default 0
- status varchar default 'enrolled'

12. activity_categories
- id uuid primary key
- kode_kegiatan varchar unique not null
- nama_kegiatan varchar not null
- deskripsi text null
- is_active boolean default true
- sort_order integer default 0
- created_at timestamp default now()

13. monthly_logbooks
- id uuid primary key
- user_id uuid references users(id)
- tahun integer not null
- bulan integer not null
- status_draft boolean default true
- tanggal_submit timestamp null
- created_at timestamp default now()
- updated_at timestamp default now()
- unique(user_id, tahun, bulan)

14. monthly_logbook_details
- id uuid primary key
- logbook_id uuid references monthly_logbooks(id) on delete cascade
- activity_category_id uuid references activity_categories(id)
- jumlah_kegiatan integer not null default 0
- keterangan text null
- created_at timestamp default now()
- updated_at timestamp default now()
- unique(logbook_id, activity_category_id)

15. report_exports
- id uuid primary key
- user_id uuid references users(id)
- periode_type varchar not null
- tahun integer not null
- bulan_awal integer not null
- bulan_akhir integer not null
- file_url text null
- generated_at timestamp default now()

16. admin_roles
- id uuid primary key
- user_id uuid references users(id)
- role_name varchar not null
- cabang_scope varchar null
- created_at timestamp default now()

17. admin_activity_logs
- id uuid primary key
- admin_user_id uuid references users(id)
- activity_type varchar not null
- target_table varchar null
- target_id uuid null
- description text null
- created_at timestamp default now()

18. broadcast_messages
- id uuid primary key
- sender_id uuid references users(id)
- target_type varchar not null
- target_filter jsonb null
- subject varchar not null
- body text not null
- sent_at timestamp default now()

Relasi utama:
- users 1:1 pmik_profiles
- users 1:1 account_settings
- users 1:1 cvs
- users 1:n messages
- users 1:n payment_invoices
- payment_invoices 1:n payment_transactions
- users 1:n lms_enrollments
- lms_courses 1:n lms_modules
- lms_courses 1:n lms_enrollments
- users 1:n monthly_logbooks
- monthly_logbooks 1:n monthly_logbook_details
- activity_categories 1:n monthly_logbook_details
- users 1:n report_exports
- users 1:n admin_roles
- users 1:n admin_activity_logs
- users 1:n broadcast_messages

Buat juga:
- Index untuk query penting
- Seed data activity_categories
- Seed admin role contoh
- View atau RPC function untuk rekap 6 bulan dan 12 bulan
- RLS policy dasar untuk member dan admin

==================================================
D. QUERY DAN ANALYTICS
==================================================

Buat query / RPC / database view untuk:
1. Rekap logbook 6 bulan per user
2. Rekap logbook 12 bulan per user
3. Pivot per jenis kegiatan dan kolom bulan
4. Nilai bulan kosong = 0
5. Daftar entri bulanan dengan pagination
6. Dashboard member:
   - total entri bulan ini
   - total kegiatan bulan ini
   - pesan belum dibaca
   - tagihan belum dibayar
   - course LMS aktif
7. Dashboard admin:
   - total member aktif
   - total member nonaktif
   - total logbook bulan ini
   - total jumlah kegiatan bulan ini
   - total invoice unpaid
   - total transaksi berhasil
   - top 10 jenis kegiatan
   - member yang belum input logbook bulan berjalan
   - member paling aktif
   - total enrollment LMS aktif

==================================================
E. KEAMANAN DAN AKSES
==================================================

Gunakan:
- Supabase Auth
- Protected route
- Middleware auth
- Role-based access control
- RLS per role
- Jangan expose service role key ke client
- Gunakan env di Netlify

Aturan akses:
- role member hanya dapat melihat dan mengubah datanya sendiri
- super_admin akses penuh
- admin_pusat akses data nasional
- admin_cabang akses data cabangnya
- finance_admin fokus pembayaran
- lms_admin fokus LMS
- verifier fokus monitoring logbook
- semua aksi admin masuk audit log

==================================================
F. PWA REQUIREMENT
==================================================

Buat:
- manifest.json
- service worker
- app icons
- install prompt
- offline fallback page
- cache asset statis
- support add to home screen

==================================================
G. STRUKTUR PROJECT
==================================================

Gunakan struktur project seperti ini:

src/
  app/
  components/
  features/
    auth/
    dashboard/
    profile/
    settings/
    cv/
    mailbox/
    help/
    payment/
    lms/
    logbook/
    admin/
      dashboard/
      members/
      payments/
      mailbox/
      lms/
      reports/
      settings/
      activity-categories/
  lib/
    supabase/
    auth/
    utils/
    hooks/
    constants/
    validators/
    services/
  types/
  public/
    icons/
    manifest.json
    sw.js

==================================================
H. OUTPUT YANG WAJIB DIHASILKAN
==================================================

Hasilkan:
1. Struktur folder lengkap
2. Source code frontend member dan admin
3. Routing halaman
4. Protected route
5. Konfigurasi Supabase client
6. SQL schema lengkap CREATE TABLE
7. Seed data activity_categories
8. Seed role admin
9. Policy RLS dasar
10. UI dashboard member
11. UI dashboard admin
12. Form input logbook
13. List logbook
14. Rekap 6 bulan
15. Rekap 12 bulan
16. Export PDF
17. Chart dashboard admin
18. Setup Netlify deployment
19. env.example
20. README setup
21. Dummy data untuk testing
22. Kode clean, modular, scalable, dan siap dikembangkan

Harapan hasil akhir:
- Siap deploy ke Netlify
- Backend siap dihubungkan ke Supabase
- Scalable untuk sekitar 10.000 member
- UX rapi, modern, cepat, dan nyaman dipakai
- Portal member dan admin konsisten
- Semua istilah di UI final menggunakan Logbook PMIK