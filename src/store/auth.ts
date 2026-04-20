import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { User, PmikProfile } from '@/types/supabase'

interface AuthState {
  user: User | null
  profile: PmikProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: PmikProfile | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, profile: null, isAuthenticated: false }),
    }),
    {
      name: 'pmik-auth',
    }
  )
)