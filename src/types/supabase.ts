export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string | null
          role: string
          status_akun: string
          last_login: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash?: string | null
          role?: string
          status_akun?: string
          last_login?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string | null
          role?: string
          status_akun?: string
          last_login?: string | null
          created_at?: string
        }
      }
      pmik_profiles: {
        Row: {
          id: string
          user_id: string
          nama_pmik: string
          nomor_anggota: string | null
          nik: string | null
          unit_kerja: string | null
          jabatan: string | null
          kota_cetak_default: string
          foto_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nama_pmik: string
          nomor_anggota?: string | null
          nik?: string | null
          unit_kerja?: string | null
          jabatan?: string | null
          kota_cetak_default?: string
          foto_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nama_pmik?: string
          nomor_anggota?: string | null
          nik?: string | null
          unit_kerja?: string | null
          jabatan?: string | null
          kota_cetak_default?: string
          foto_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      account_settings: {
        Row: {
          id: string
          user_id: string
          notif_email: boolean
          notif_push: boolean
          bahasa: string
          tema: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notif_email?: boolean
          notif_push?: boolean
          bahasa?: string
          tema?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notif_email?: boolean
          notif_push?: boolean
          bahasa?: string
          tema?: string
          updated_at?: string
        }
      }
      cvs: {
        Row: {
          id: string
          user_id: string
          ringkasan: string | null
          pendidikan: string | null
          pengalaman_kerja: string | null
          sertifikasi: string | null
          organisasi: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ringkasan?: string | null
          pendidikan?: string | null
          pengalaman_kerja?: string | null
          sertifikasi?: string | null
          organisasi?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ringkasan?: string | null
          pendidikan?: string | null
          pengalaman_kerja?: string | null
          sertifikasi?: string | null
          organisasi?: string | null
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          subject: string
          body: string
          is_read: boolean
          sent_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          subject: string
          body: string
          is_read?: boolean
          sent_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          subject?: string
          body?: string
          is_read?: boolean
          sent_at?: string
          read_at?: string | null
        }
      }
      help_articles: {
        Row: {
          id: string
          judul: string
          slug: string
          isi: string
          kategori: string | null
          is_published: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          judul: string
          slug: string
          isi: string
          kategori?: string | null
          is_published?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          judul?: string
          slug?: string
          isi?: string
          kategori?: string | null
          is_published?: boolean
          updated_at?: string
        }
      }
      payment_invoices: {
        Row: {
          id: string
          user_id: string
          invoice_no: string
          jenis_iuran: string
          periode: string
          nominal: number
          status: string
          due_date: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_no: string
          jenis_iuran: string
          periode: string
          nominal: number
          status?: string
          due_date?: string | null
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_no?: string
          jenis_iuran?: string
          periode?: string
          nominal?: number
          status?: string
          due_date?: string | null
          paid_at?: string | null
          created_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          invoice_id: string | null
          payment_method: string | null
          reference_no: string | null
          amount: number
          payment_gateway_response: Json | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id?: string | null
          payment_method?: string | null
          reference_no?: string | null
          amount: number
          payment_gateway_response?: Json | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string | null
          payment_method?: string | null
          reference_no?: string | null
          amount?: number
          payment_gateway_response?: Json | null
          status?: string
          created_at?: string
        }
      }
      lms_courses: {
        Row: {
          id: string
          judul: string
          kategori: string | null
          deskripsi: string | null
          thumbnail_url: string | null
          status_publish: boolean
          created_at: string
        }
        Insert: {
          id?: string
          judul: string
          kategori?: string | null
          deskripsi?: string | null
          thumbnail_url?: string | null
          status_publish?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          judul?: string
          kategori?: string | null
          deskripsi?: string | null
          thumbnail_url?: string | null
          status_publish?: boolean
          created_at?: string
        }
      }
      lms_modules: {
        Row: {
          id: string
          course_id: string
          judul_modul: string
          urutan: number
          tipe_konten: string
          konten_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          judul_modul: string
          urutan: number
          tipe_konten: string
          konten_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          judul_modul?: string
          urutan?: number
          tipe_konten?: string
          konten_url?: string | null
          created_at?: string
        }
      }
      lms_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          progress_percent: number
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          progress_percent?: number
          status?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          progress_percent?: number
          status?: string
        }
      }
      activity_categories: {
        Row: {
          id: string
          kode_kegitan: string
          nama_kegitan: string
          deskripsi: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          kode_kegitan: string
          nama_kegitan: string
          deskripsi?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          kode_kegitan?: string
          nama_kegitan?: string
          deskripsi?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      monthly_logbooks: {
        Row: {
          id: string
          user_id: string
          tahun: number
          bulan: number
          status_draft: boolean
          tanggal_submit: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tahun: number
          bulan: number
          status_draft?: boolean
          tanggal_submit?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tahun?: number
          bulan?: number
          status_draft?: boolean
          tanggal_submit?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      monthly_logbook_details: {
        Row: {
          id: string
          logbook_id: string
          activity_category_id: string
          jumlah_kegitan: number
          keterangan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          logbook_id: string
          activity_category_id: string
          jumlah_kegitan?: number
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          logbook_id?: string
          activity_category_id?: string
          jumlah_kegitan?: number
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      report_exports: {
        Row: {
          id: string
          user_id: string
          periode_type: string
          tahun: number
          bulan_awal: number
          bulan_akhir: number
          file_url: string | null
          generated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          periode_type: string
          tahun: number
          bulan_awal: number
          bulan_akhir: number
          file_url?: string | null
          generated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          periode_type?: string
          tahun?: number
          bulan_awal?: number
          bulan_akhir?: number
          file_url?: string | null
          generated_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type PmikProfile = Database['public']['Tables']['pmik_profiles']['Row']
export type AccountSettings = Database['public']['Tables']['account_settings']['Row']
export type Cv = Database['public']['Tables']['cvs']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type HelpArticle = Database['public']['Tables']['help_articles']['Row']
export type PaymentInvoice = Database['public']['Tables']['payment_invoices']['Row']
export type PaymentTransaction = Database['public']['Tables']['payment_transactions']['Row']
export type LmsCourse = Database['public']['Tables']['lms_courses']['Row']
export type LmsModule = Database['public']['Tables']['lms_modules']['Row']
export type LmsEnrollment = Database['public']['Tables']['lms_enrollments']['Row']
export type ActivityCategory = Database['public']['Tables']['activity_categories']['Row']
export type MonthlyLogbook = Database['public']['Tables']['monthly_logbooks']['Row']
export type MonthlyLogbookDetail = Database['public']['Tables']['monthly_logbook_details']['Row']
export type ReportExport = Database['public']['Tables']['report_exports']['Row']