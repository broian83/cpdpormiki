-- ============================================
-- SEED DATA FOR ACTIVITY CATEGORIES
-- Master Jenis Kegiatan PMIK
-- ============================================

INSERT INTO public.activity_categories (kode_kegitan, nama_kegitan, deskripsi, is_active) VALUES
('PENDAFTARAN', 'Pendaftaran pasien', 'Penerimaan dan registrasi pasien baru dan lama', true),
('ASSEMBLING', 'Assembling rekam medis', 'Perakitan dan pengelompokanBerkas Rekam Medis', true),
('ANALISIS_KUANTITATIF', 'Analisis kuantitatif rekam medis', 'Perhitungan dan analisis data kuantitatif RM', true),
('CODING_DIAGNOSIS', 'Coding diagnosis', 'Pengkodean diagnosis疾病(ICD-10)', true),
('CODING_TINDAKAN', 'Coding tindakan', 'Pengkodean tindakanmedis (ICD-9-CM)', true),
('INDEXING', 'Indexing', 'Pembuatan indeks dan referensi silang', true),
('FILING', 'Filing', 'Penyimpanan dan pengarsipanBerkas Rekam Medis', true),
('RETENSI', 'Retensi arsip rekam medis', 'Penentuan masa retensi dokumen RM', true),
('DISTRIBUSI', 'Distribusi dokumen rekam medis', 'PendistribusianBerkas ke unit terkait', true),
('MONITORING_LENGKAP', 'Monitoring kelengkapan rekam medis', 'Pemantauan kelengkapan isiBerkas RM', true),
('PELAPORAN_STATISTIK', 'Pelaporan statistik rumah sakit', 'Penyusunan laporan statistik RS', true),
('VERIFIKASI_KLAIM', 'Verifikasi klaim/BPJS', 'Verifikasi kelayakan klaimBpjs Kesehatan', true),
('AUDIT_MUTU', 'Audit mutu rekam medis', 'Evaluasi mutu dan kelengkapan RM', true),
('EDUKASI', 'Edukasi/sosialisasi unit', 'Penyuluhan dan Sosialisasi unit kerja', true),
('RAPAT', 'Rapat/koordinasi', 'Kehadiran rapatinternal', true),
('PENGELOLAAN_RME', 'Pengelolaan RME', 'Pengelolaan Rekam Medis Elektronik', true),
('VALIDASI_DATA', 'Validasi data pasien', 'Validasi kebenaran data pasien', true),
('PENYISIRAN', 'PenyisiranBerkas pending', 'PemeriksaanBerkas yang belum lengkap', true),
('QC_DOKUMEN', 'Quality control dokumen rekam medis', 'Pemeriksaan kualitas dokumen RM', true)
ON CONFLICT (kode_kegitan) DO NOTHING;

-- ============================================
-- SEED DATA FOR HELP ARTICLES
-- ============================================

INSERT INTO public.help_articles (judul, slug, isi, kategori, is_published) VALUES
('Cara Login ke Member Area', 'cara-login', 'Untuk login ke Member Area PMIK, gunakan email yang telah terdaftar dan password yang Anda buat saat registrasi. Jika lupa password, gunakan fitur Lupa Password.', 'Akun', true),
('Cara Mengisi Logbook PMIK', 'cara-mengisi-logbook', 'Logbook PMIK digunakan untuk mencatat kegiatan bulanan Anda. Pilih tahun dan bulan, pilih jenis kegiatan, masukkan jumlah kegiatan, dan tambahkan keterangan jika diperlukan.', 'Logbook', true),
('Cara Melihat Rekap Logbook', 'cara-melihat-rekap', 'Untuk melihat rekap logbook, navigate ke menu Logbook PMIK > Rekap. Anda dapat memilih rekap 6 bulan atau 12 bulan sesuai periode yang diinginkan.', 'Logbook', true),
('Cara Export Laporan PDF', 'cara-export-pdf', 'Setelah melihat rekap, klik tombol Export PDF untuk mengunduh laporan dalam format PDF. Laporan akan mencakup nama Anda dan periode yang dipilih.', 'Logbook', true),
('Cara Update Profil', 'cara-update-profil', 'Untuk update profil, navigate ke menu Profil PMIK dan klik tombol Edit. Pastikan data yang Anda masukkan sudah benar.', 'Profil', true),
('Cara Melakukan Pembayaran Iuran', 'cara-pembayaran', 'Navigate ke menu Pembayaran Iuran untuk melihat tagihan. Klik Bayar untuk melakukan pembayaran melalui gateway yang tersedia.', 'Pembayaran', true),
('Cara Mengikuti Kursus LMS', 'cara-lms', 'Pilih kursus yang интерес dari daftar, klik Daftar, dan mulai belajar. Progress Anda akan otomatis terekam.', 'LMS', true),
('Cara Mengirim Pesan', 'cara-kirim-pesan', 'Navigate ke Mailbox > Tulis Pesan, masukkan sujet dan isi pesan, lalu klik Kirim.', 'Mailbox', true);

-- ============================================
-- SAMPLE DATA FOR TESTING (DEMO)
-- ============================================

-- Note: In production, use Supabase Auth for user management
-- These are sample data for development testing only

-- Sample users will be created via Supabase Auth dashboard
-- Sample profiles can be inserted after users are created