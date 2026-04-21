-- ============================================
-- DATABASE SCHEMA FOR PMIK MEMBER AREA
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: system_settings
-- ============================================
CREATE TABLE IF NOT EXISTS public.system_settings (
    id VARCHAR(100) PRIMARY KEY,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'member',
    status_akun VARCHAR(50) DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: pmik_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS public.pmik_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nama_pmik VARCHAR(255) NOT NULL,
    nomor_anggota VARCHAR(50) UNIQUE,
    nik VARCHAR(20),
    unit_kerja VARCHAR(255),
    jabatan VARCHAR(255),
    kota_cetak_default VARCHAR(100) DEFAULT 'Jakarta',
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: account_settings
-- ============================================
CREATE TABLE IF NOT EXISTS public.account_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    notif_email BOOLEAN DEFAULT TRUE,
    notif_push BOOLEAN DEFAULT TRUE,
    bahasa VARCHAR(10) DEFAULT 'id',
    tema VARCHAR(20) DEFAULT 'light',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: cvs
-- ============================================
CREATE TABLE IF NOT EXISTS public.cvs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    ringkasan TEXT,
    pendidikan TEXT,
    pengalaman_kerja TEXT,
    sertifikasi TEXT,
    organisasi TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: messages
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABLE: help_articles
-- ============================================
CREATE TABLE IF NOT EXISTS public.help_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    isi TEXT NOT NULL,
    kategori VARCHAR(100),
    is_published BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: payment_invoices
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    jenis_iuran VARCHAR(100) NOT NULL,
    periode VARCHAR(50) NOT NULL,
    nominal NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'unpaid',
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: payment_transactions
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.payment_invoices(id) ON DELETE SET NULL,
    payment_method VARCHAR(100),
    reference_no VARCHAR(100),
    amount NUMERIC(12, 2) NOT NULL,
    payment_gateway_response JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: lms_courses
-- ============================================
CREATE TABLE IF NOT EXISTS public.lms_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(500) NOT NULL,
    kategori VARCHAR(100),
    deskripsi TEXT,
    thumbnail_url TEXT,
    status_publish BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: lms_modules
-- ============================================
CREATE TABLE IF NOT EXISTS public.lms_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.lms_courses(id) ON DELETE CASCADE,
    judul_modul VARCHAR(500) NOT NULL,
    urutan INTEGER NOT NULL,
    tipe_konten VARCHAR(50) NOT NULL,
    konten_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CASE lms_enrollments
-- ============================================
CREATE TABLE IF NOT EXISTS public.lms_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.lms_courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_percent NUMERIC(5, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'enrolled',
    UNIQUE(user_id, course_id)
);

-- ============================================
-- TABLE: lms_user_modules (Progress per module)
-- ============================================
CREATE TABLE IF NOT EXISTS public.lms_user_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.lms_modules(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, module_id)
);

-- ============================================
-- TABLE: activity_categories
-- Master Jenis Kegiatan PMIK
-- ============================================
CREATE TABLE IF NOT EXISTS public.activity_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode_kegitan VARCHAR(50) UNIQUE NOT NULL,
    nama_kegitan VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: monthly_logbooks
-- ============================================
CREATE TABLE IF NOT EXISTS public.monthly_logbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    tahun INTEGER NOT NULL,
    bulan INTEGER NOT NULL,
    status_draft BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, validated, revision_needed
    tanggal_submit TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tahun, bulan)
);

-- ============================================
-- TABLE: monthly_logbook_details
-- ============================================
CREATE TABLE IF NOT EXISTS public.monthly_logbook_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logbook_id UUID REFERENCES public.monthly_logbooks(id) ON DELETE CASCADE,
    activity_category_id UUID REFERENCES public.activity_categories(id),
    jumlah_kegitan INTEGER NOT NULL DEFAULT 0,
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(logbook_id, activity_category_id)
);

-- ============================================
-- TABLE: report_exports
-- ============================================
CREATE TABLE IF NOT EXISTS public.report_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    periode_type VARCHAR(20) NOT NULL,
    tahun INTEGER NOT NULL,
    bulan_awal INTEGER NOT NULL,
    bulan_akhir INTEGER NOT NULL,
    file_url TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: system_settings
-- Stores global configuration like API keys
-- ============================================
CREATE TABLE IF NOT EXISTS public.system_settings (
    id VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================
-- TABLE: help_tickets
-- ============================================
CREATE TABLE IF NOT EXISTS public.help_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    subject VARCHAR(500),
    description TEXT NOT NULL,
    type VARCHAR(100) DEFAULT 'Ticketing',
    category VARCHAR(100),
    urgency VARCHAR(50) DEFAULT 'Normal',
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_pmik_profiles_user_id ON public.pmik_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_account_settings_user_id ON public.account_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_payment_invoices_user_id ON public.payment_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_invoices_status ON public.payment_invoices(status);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_user_id ON public.lms_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_course_id ON public.lms_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_monthly_logbooks_user_id ON public.monthly_logbooks(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_logbooks_user_tahun_bulan ON public.monthly_logbooks(user_id, tahun, bulan);
CREATE INDEX IF NOT EXISTS idx_monthly_logbook_details_logbook_id ON public.monthly_logbook_details(logbook_id);
CREATE INDEX IF NOT EXISTS idx_report_exports_user_id ON public.report_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_help_tickets_user_id ON public.help_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_help_tickets_status ON public.help_tickets(status);