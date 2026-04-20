export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Member Area PMIK'
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Portal Member Area PROFESIONAL MANAJEMEN INFORMASI KESEHATAN (PMIK) Indonesia'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const DEFAULT_KOTA_CETAK = process.env.NEXT_PUBLIC_DEFAULT_KOTA_CETAK || 'Jakarta'

export const BULAN_OPTIONS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
]

export const TAHUN_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const tahun = new Date().getFullYear() - i
  return { value: tahun, label: tahun.toString() }
})

export const PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/private-area', label: 'Private Area', icon: 'Lock' },
  { href: '/mailbox', label: 'Mailbox / Pesan', icon: 'Mail' },
  { href: '/help', label: 'Help / Bantuan', icon: 'HelpCircle' },
  { href: '/profile', label: 'Profil PMIK', icon: 'User' },
  { href: '/settings', label: 'Account Settings', icon: 'Settings' },
  { href: '/cv', label: 'Curriculum Vitae', icon: 'FileText' },
  { href: '/payment', label: 'Pembayaran Iuran', icon: 'CreditCard' },
  { href: '/lms', label: 'Portal LMS', icon: 'BookOpen' },
  { href: '/logbook', label: 'Logbook PMIK', icon: 'BookMarked' },
]

export const MOBILE_NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/logbook', label: 'Logbook PMIK', icon: 'BookMarked' },
  { href: '/mailbox', label: 'Pesan', icon: 'Mail' },
  { href: '/lms', label: 'LMS', icon: 'BookOpen' },
  { href: '/profile', label: 'Profil', icon: 'User' },
]

export const SIDEBAR_NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/private-area', label: 'Private Area', icon: 'Lock' },
  { href: '/settings', label: 'Account Settings', icon: 'Settings' },
  { href: '/cv', label: 'Curriculum Vitae', icon: 'FileText' },
  { href: '/payment', label: 'Pembayaran Iuran', icon: 'CreditCard' },
  { href: '/help', label: 'Help', icon: 'HelpCircle' },
  { href: '/logout', label: 'Logout', icon: 'LogOut' },
]

export const LOGBOOK_SUBMENU = [
  { href: '/logbook', label: 'Petunjuk Pengisian Logbook PMIK', icon: 'HelpCircle' },
  { href: '/logbook/input', label: 'Input Logbook Bulanan', icon: 'Plus' },
  { href: '/logbook/list', label: 'Daftar Entri Logbook', icon: 'List' },
  { href: '/logbook/rekap-6', label: 'Rekap 6 Bulan', icon: 'Calendar' },
  { href: '/logbook/rekap-12', label: 'Rekap 12 Bulan', icon: 'Calendar' },
  { href: '/logbook/export', label: 'Cetak / Export Laporan', icon: 'Download' },
]