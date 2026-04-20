-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- For PMIK Member Area
-- ============================================

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pmik_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_logbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_logbook_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- PMIK PROFILES POLICIES
-- ============================================
CREATE POLICY "Anyone can view published profiles" ON public.pmik_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.pmik_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.pmik_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- ACCOUNT SETTINGS POLICIES
-- ============================================
CREATE POLICY "Users can view own settings" ON public.account_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.account_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.account_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- CVS POLICIES
-- ============================================
CREATE POLICY "Users can view own CV" ON public.cvs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV" ON public.cvs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV" ON public.cvs
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- MESSAGES POLICIES
-- ============================================
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================
-- HELP ARTICLES POLICIES
-- ============================================
CREATE POLICY "Anyone can view published help articles" ON public.help_articles
    FOR SELECT USING (is_published = true);

-- ============================================
-- PAYMENT INVOICES POLICIES
-- ============================================
CREATE POLICY "Users can view own invoices" ON public.payment_invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices" ON public.payment_invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON public.payment_invoices
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- PAYMENT TRANSACTIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own transactions" ON public.payment_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.payment_invoices pi
            WHERE pi.id = invoice_id AND pi.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own transactions" ON public.payment_transactions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.payment_invoices pi
            WHERE pi.id = invoice_id AND pi.user_id = auth.uid()
        )
    );

-- ============================================
-- LMS COURSES POLICIES
-- ============================================
CREATE POLICY "Anyone can view published courses" ON public.lms_courses
    FOR SELECT USING (status_publish = true);

-- ============================================
-- LMS MODULES POLICIES
-- ============================================
CREATE POLICY "Anyone can view modules" ON public.lms_modules
    FOR SELECT USING (true);

-- ============================================
-- LMS ENROLLMENTS POLICIES
-- ============================================
CREATE POLICY "Users can view own enrollments" ON public.lms_enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON public.lms_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON public.lms_enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- ACTIVITY CATEGORIES POLICIES
-- ============================================
CREATE POLICY "Anyone can view active categories" ON public.activity_categories
    FOR SELECT USING (is_active = true);

-- ============================================
-- MONTHLY LOGBOOKS POLICIES
-- ============================================
CREATE POLICY "Users can view own logbooks" ON public.monthly_logbooks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logbooks" ON public.monthly_logbooks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logbooks" ON public.monthly_logbooks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own logbooks" ON public.monthly_logbooks
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- MONTHLY LOGBOOK DETAILS POLICIES
-- ============================================
CREATE POLICY "Users can view own logbook details" ON public.monthly_logbook_details
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.monthly_logbooks mlb
            WHERE mlb.id = logbook_id AND mlb.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own logbook details" ON public.monthly_logbook_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.monthly_logbooks mlb
            WHERE mlb.id = logbook_id AND mlb.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own logbook details" ON public.monthly_logbook_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.monthly_logbooks mlb
            WHERE mlb.id = logbook_id AND mlb.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own logbook details" ON public.monthly_logbook_details
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.monthly_logbooks mlb
            WHERE mlb.id = logbook_id AND mlb.user_id = auth.uid()
        )
    );

-- ============================================
-- REPORT EXPORTS POLICIES
-- ============================================
CREATE POLICY "Users can view own report exports" ON public.report_exports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own report exports" ON public.report_exports
    FOR INSERT WITH CHECK (auth.uid() = user_id);