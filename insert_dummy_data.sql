-- ============================================
-- SQL SCRIPT: INSERT DUMMY DATA FOR PMIK SUPER APP (FIXED UUID)
-- Data dummy untuk Anggota, LMS, dan Kategori Kegiatan
-- ============================================

-- 1. DATA MASTER: Kategori Kegiatan (Activity Categories)
INSERT INTO public.activity_categories (id, kode_kegitan, nama_kegitan, deskripsi, is_active)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'K001', 'Pelayanan Rekam Medis (Coding)', 'Kegiatan pengkodean diagnosa dan tindakan pasien.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'K002', 'Pelayanan Rekam Medis (Assembling)', 'Kegiatan merakit dan menata berkas rekam medis.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'K003', 'Pelayanan Rekam Medis (Filling)', 'Kegiatan menyimpan dan mengambil kembali berkas.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'K004', 'Analisis Kuantitatif & Kualitatif', 'Kegiatan mereview kelengkapan pengisian rekam medis.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'K005', 'Pelatihan / Seminar Profesi', 'Keikutsertaan dalam seminar atau workshop resmi.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'K006', 'Pembuatan Laporan Tahunan RS', 'Menyusun statistik dan laporan rutin rumah sakit.', true)
ON CONFLICT (kode_kegitan) DO NOTHING;

-- 2. DATA LMS: Daftar Kursus (Courses)
INSERT INTO public.lms_courses (id, judul, kategori, deskripsi, thumbnail_url, status_publish)
VALUES 
('c1b50e2d-dc99-43ef-b387-052637738f61', 'Akselerasi Rekam Medis Elektronik (RME)', 'Digitalisasi', 'Panduan teknis dan regulasi transisi dari sistem kertas ke RME sesuai Permenkes.', 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800', true),
('c1b50e2d-dc99-43ef-b387-052637738f62', 'Manajemen Kode ICD-10 JKN', 'Coding', 'Teknik coding akurat untuk optimasi klaim BPJS Kesehatan.', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800', true),
('c1b50e2d-dc99-43ef-b387-052637738f63', 'Aspek Hukum Rekam Medis', 'Legal', 'Memahami perlindungan hukum bagi Perekam Medis dalam praktik sehari-hari.', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800', true),
('c1b50e2d-dc99-43ef-b387-052637738f64', 'Kepemimpinan di Unit RM', 'Soft Skills', 'Membangun kerjasama tim yang solid di instalasi rekam medis.', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800', true)
ON CONFLICT (id) DO NOTHING;

-- 3. DATA LMS: Modul Materi (Modules)
INSERT INTO public.lms_modules (course_id, judul_modul, urutan, tipe_konten)
VALUES 
('c1b50e2d-dc99-43ef-b387-052637738f61', 'Dasar Hukum RME di Indonesia', 1, 'video'),
('c1b50e2d-dc99-43ef-b387-052637738f61', 'Standar Interoperabilitas (SatuSehat)', 2, 'pdf'),
('c1b50e2d-dc99-43ef-b387-052637738f61', 'Keamanan Data & Privasi Pasien', 3, 'quiz'),
('c1b50e2d-dc99-43ef-b387-052637738f62', 'Prinsip Dasar Coding Diagnosa', 1, 'video'),
('c1b50e2d-dc99-43ef-b387-052637738f62', 'Coding Penyakit Infeksi & Menular', 2, 'video'),
('c1b50e2d-dc99-43ef-b387-052637738f62', 'Studi Kasus Klaim Dispute', 3, 'pdf');

-- 4. DATA USER & PROFIL (Dummy Users)
INSERT INTO public.users (id, email, role, status_akun)
VALUES 
('11b50e2d-dc99-43ef-b387-052637738f01', 'anggota1@pormiki.or.id', 'member', 'active'),
('11b50e2d-dc99-43ef-b387-052637738f02', 'anggota2@pormiki.or.id', 'member', 'active'),
('11b50e2d-dc99-43ef-b387-052637738f03', 'anggota3@pormiki.or.id', 'member', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.pmik_profiles (user_id, nama_pmik, nomor_anggota, nik, unit_kerja, jabatan)
VALUES 
('11b50e2d-dc99-43ef-b387-052637738f01', 'Andi Hermawan, A.Md.RMIK', '3174-2024-00123', '3275010101900001', 'RSUD Kota Bekasi', 'Kepala Instalasi RM'),
('11b50e2d-dc99-43ef-b387-052637738f02', 'Siti Aminah, S.Tr.RMIK', '3174-2024-00567', '3275010101920005', 'Puskesmas Jatisampurna', 'Perekam Medis Pelaksana'),
('11b50e2d-dc99-43ef-b387-052637738f03', 'Budi Santoso, M.K.M', '3174-2024-00999', '3275010101850009', 'RS Permata Ibu', 'Koder Senior')
ON CONFLICT (nomor_anggota) DO NOTHING;

-- 5. DATA INVOICE (Dummy Payments)
INSERT INTO public.payment_invoices (user_id, invoice_no, jenis_iuran, periode, nominal, status)
VALUES 
('11b50e2d-dc99-43ef-b387-052637738f01', 'INV-2024-04-001', 'Iuran Tahunan 2024', 'Januari - Desember 2024', 150000.00, 'unpaid'),
('11b50e2d-dc99-43ef-b387-052637738f02', 'INV-2024-04-002', 'Iuran Tahunan 2024', 'Januari - Desember 2024', 150000.00, 'paid')
ON CONFLICT (invoice_no) DO NOTHING;

-- 6. DATA ENROLLMENT (LMS Activity)
INSERT INTO public.lms_enrollments (user_id, course_id, progress_percent, status)
VALUES 
('11b50e2d-dc99-43ef-b387-052637738f01', 'c1b50e2d-dc99-43ef-b387-052637738f61', 45.5, 'enrolled'),
('11b50e2d-dc99-43ef-b387-052637738f01', 'c1b50e2d-dc99-43ef-b387-052637738f62', 10.0, 'enrolled')
ON CONFLICT (user_id, course_id) DO NOTHING;
