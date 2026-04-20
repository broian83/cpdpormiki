# Member Area PMIK

Portal Member Area PROFESIONAL MANAJEMEN INFORMASI KESEHATAN (PMIK) Indonesia

## Tech Stack

- **Frontend**: Next.js 14+ App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **PDF**: jsPDF + jspdf-autotable
- **PWA**: next-pwa

## Fitur

- Dashboard
- Logbook PMIK (Input, List, Rekap 6/12 Bulan, Export PDF)
- Profil PMIK
- Account Settings
- Curriculum Vitae
- Mailbox / Pesan
- Pembayaran Iuran
- Kegiatan LMS
- Help Center
- Private Area
- PWA Support

## Prerequisites

1. Node.js 18+
2. Supabase Account

## Setup

### 1. Clone repository

```bash
git clone <repo-url>
cd cpdpormiki
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Member Area PMIK
NEXT_PUBLIC_DEFAULT_KOTA_CETAK=Jakarta
```

### 4. Setup Supabase

1. Create new project di https://supabase.com
2. Run SQL dari `supabase_schema.sql` di Supabase SQL Editor
3. Run SQL dari `supabase_seed.sql` untuk seed data
4. Run SQL dari `supabase_rls.sql` untuk RLS policies

### 5. Run development server

```bash
npm run dev
```

Buka http://localhost:3000

## Deployment ke Netlify

### Using Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Using GitHub

1. Push code ke GitHub
2. Connect repository ke Netlify
3. Set environment variables di Netlify Dashboard
4. Deploy akan otomatis

## Struktur Folder

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable components
│   ├── ui/          # Base UI components
│   ├── layout/       # Layout components
│   ├── auth/        # Auth components
│   └── logbook/     # Logbook components
├── lib/             # Utilities
│   ├── supabase/    # Supabase client
│   ├── utils/      # Helper functions
│   ├── hooks/      # Custom hooks
│   ├── constants/  # App constants
│   └── validators/  # Zod schemas
├── store/           # Zustand stores
├── types/           # TypeScript types
└── public/         # Static assets
    └── manifest.json
```

## Lisensi

MIT