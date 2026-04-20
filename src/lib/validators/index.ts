import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
  nama_pmik: z.string().min(2, 'Nama PMIK minimal 2 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export const profileSchema = z.object({
  nama_pmik: z.string().min(2, 'Nama PMIK minimal 2 karakter'),
  nomor_anggota: z.string().optional(),
  nik: z.string().optional(),
  unit_kerja: z.string().optional(),
  jabatan: z.string().optional(),
  kota_cetak_default: z.string().default('Jakarta'),
})

export const accountSettingsSchema = z.object({
  notif_email: z.boolean().default(true),
  notif_push: z.boolean().default(true),
  bahasa: z.string().default('id'),
  tema: z.string().default('light'),
})

export const cvSchema = z.object({
  ringkasan: z.string().optional(),
  pendidikan: z.string().optional(),
  pengalaman_kerja: z.string().optional(),
  sertifikasi: z.string().optional(),
  organisasi: z.string().optional(),
})

export const messageSchema = z.object({
  receiver_id: z.string().uuid('Penerima wajib dipilih'),
  subject: z.string().min(1, 'Subjek wajib diisi'),
  body: z.string().min(1, 'Isi pesan wajib diisi'),
})

export const logbookDetailSchema = z.object({
  activity_category_id: z.string().uuid('Jenis kegiatan wajib dipilih'),
  jumlah_kegitan: z.number().int().min(0, 'Jumlah kegiatan minimal 0'),
  keterangan: z.string().optional(),
})

export const logbookInputSchema = z.object({
  tahun: z.number().min(2020).max(2030),
  bulan: z.number().min(1).max(12),
  details: z.array(logbookDetailSchema).min(1, 'Minimal 1 kegiatan'),
})

export const helpArticleSchema = z.object({
  judul: z.string().min(1, 'Judul wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
  isi: z.string().min(1, 'Isi artikel wajib diisi'),
  kategori: z.string().optional(),
  is_published: z.boolean().default(true),
})

export const lmsCourseSchema = z.object({
  judul: z.string().min(1, 'Judul kursus wajib diisi'),
  kategori: z.string().optional(),
  deskripsi: z.string().optional(),
  thumbnail_url: z.string().url().optional(),
  status_publish: z.boolean().default(true),
})

export const paymentInvoiceSchema = z.object({
  jenis_iuran: z.string().min(1, 'Jenis iuran wajib diisi'),
  periode: z.string().min(1, 'Periode wajib diisi'),
  nominal: z.number().positive('Nominal harus lebih dari 0'),
  due_date: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type AccountSettingsInput = z.infer<typeof accountSettingsSchema>
export type CvInput = z.infer<typeof cvSchema>
export type MessageInput = z.infer<typeof messageSchema>
export type LogbookDetailInput = z.infer<typeof logbookDetailSchema>
export type LogbookInput = z.infer<typeof logbookInputSchema>
export type HelpArticleInput = z.infer<typeof helpArticleSchema>
export type LmsCourseInput = z.infer<typeof lmsCourseSchema>
export type PaymentInvoiceInput = z.infer<typeof paymentInvoiceSchema>