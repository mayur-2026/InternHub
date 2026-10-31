import React, { createContext, useContext, useState, useEffect } from 'react'
import type { UserProfile } from '../types'
import { INITIAL_USER, DEMO_USER } from '../data/seedData'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  error: string | null
  isDemo: boolean
  loginWithGoogle: () => Promise<void>
  loginAsDemo: () => void
  logout: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'internhub_auth_user'
const DEMO_STORAGE_KEY = 'internhub_is_demo'
const LOGGED_OUT_KEY = 'internhub_logged_out'

// Detect if current browser URL is an incoming OAuth callback from Supabase/Google
const isOAuthCallback = () => {
  if (typeof window === 'undefined') return false
  const hasCode = window.location.search.includes('code=')
  const hasToken = window.location.hash.includes('access_token=')
  const hasError = window.location.search.includes('error=') || window.location.hash.includes('error=')
  return hasCode || hasToken || hasError
}

const getInitialOAuthError = (): string | null => {
  if (typeof window === 'undefined') return null
  const searchParams = new URLSearchParams(window.location.search)
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, '?'))
  const msg =
    searchParams.get('error_description') ||
    hashParams.get('error_description') ||
    searchParams.get('error') ||
    hashParams.get('error')
  return msg ? decodeURIComponent(msg.replace(/\+/g, ' ')) : null
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasIncomingCallback = isOAuthCallback()

  // If returning from Google OAuth, clear explicit logged out flag
  if (hasIncomingCallback && typeof window !== 'undefined') {
    localStorage.removeItem(LOGGED_OUT_KEY)
  }

  const [user, setUser] = useState<UserProfile | null>(() => {
    // If incoming OAuth callback, start null and let verification complete
    if (hasIncomingCallback) return null

    if (typeof window !== 'undefined' && localStorage.getItem(LOGGED_OUT_KEY) === 'true') {
      return null
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return null
      }
    }
    return INITIAL_USER
  })

  const [isDemo, setIsDemo] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem(DEMO_STORAGE_KEY) !== 'false'
  })

  const initialOAuthError = getInitialOAuthError()
  const [loading, setLoading] = useState<boolean>(() => hasIncomingCallback && !initialOAuthError)
  const [error, setError] = useState<string | null>(initialOAuthError)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    // Clean up any error query params once read
    if (initialOAuthError && typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    // 1. If PKCE auth code is present, exchange it for a session
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ data, error: exchangeError }) => {
          if (!exchangeError && data?.session?.user) {
            syncUser(data.session.user)
            window.history.replaceState({}, document.title, window.location.pathname)
          } else if (exchangeError) {
            setError(exchangeError.message)
            setLoading(false)
          }
        })
      }
    }

    const syncUser = async (authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }) => {
      const meta = authUser.user_metadata || {}
      let profileFromDb: Partial<UserProfile> | null = null

      if (isSupabaseConfigured) {
        try {
          const { data: dbProfile, error: dbError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle()

          if (!dbError && dbProfile) {
            profileFromDb = {
              fullName: dbProfile.full_name || undefined,
              avatarUrl: dbProfile.avatar_url || undefined,
              bio: dbProfile.bio ?? '',
              university: dbProfile.university ?? '',
              graduationYear: dbProfile.graduation_year ?? '',
              githubUrl: dbProfile.github_url ?? '',
              linkedinUrl: dbProfile.linkedin_url ?? '',
              role: dbProfile.role || 'Student Intern',
              track: dbProfile.track || 'Full-Stack Web Engineering',
              joinedDate: dbProfile.created_at
                ? new Date(dbProfile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : undefined,
            }
          } else {
            // First time login - initialize clean record in Supabase
            const fullName = String(meta.full_name || meta.name || authUser.email?.split('@')[0] || 'Student Intern')
            const avatarUrl = String(meta.avatar_url || meta.picture || '')
            await supabase.from('profiles').upsert(
              {
                id: authUser.id,
                email: authUser.email || '',
                full_name: fullName,
                avatar_url: avatarUrl,
                role: 'Student Intern',
                track: 'Full-Stack Web Engineering',
              },
              { onConflict: 'id' }
            )
          }
        } catch (err) {
          console.warn('Profile sync notice:', err)
        }
      }

      const defaultAvatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`

      const syncedUser: UserProfile = {
        id: authUser.id,
        email: authUser.email || 'user@gmail.com',
        fullName:
          profileFromDb?.fullName ||
          String(meta.full_name || meta.name || authUser.email?.split('@')[0] || 'Student Intern'),
        avatarUrl:
          profileFromDb?.avatarUrl ||
          String(meta.avatar_url || meta.picture || defaultAvatar),
        bio: profileFromDb?.bio ?? '',
        university: profileFromDb?.university ?? '',
        graduationYear: profileFromDb?.graduationYear ?? '',
        githubUrl: profileFromDb?.githubUrl ?? '',
        linkedinUrl: profileFromDb?.linkedinUrl ?? '',
        role: profileFromDb?.role || 'Student Intern',
        track: profileFromDb?.track || 'Full-Stack Web Engineering',
        joinedDate:
          profileFromDb?.joinedDate ||
          new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      }

      setUser(syncedUser)
      setIsDemo(false)
      localStorage.removeItem(LOGGED_OUT_KEY)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(syncedUser))
      localStorage.setItem(DEMO_STORAGE_KEY, 'false')
      setLoading(false)
    }

    // Check existing active session on mount
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (!sessionError && session?.user) {
        syncUser(session.user)
      } else if (!hasIncomingCallback) {
        setLoading(false)
      }
    })

    // Listen to real Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          syncUser(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [hasIncomingCallback, initialOAuthError])

  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      localStorage.removeItem(LOGGED_OUT_KEY)

      if (!isSupabaseConfigured) {
        // Fallback simulation if env variables are not yet populated
        setTimeout(() => {
          setUser(INITIAL_USER)
          setIsDemo(true)
          localStorage.removeItem(LOGGED_OUT_KEY)
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(INITIAL_USER))
          localStorage.setItem(DEMO_STORAGE_KEY, 'true')
          setLoading(false)
        }, 600)
        return
      }

      // Explicitly redirect back to /dashboard with origin
      const redirectUrl = `${window.location.origin}/dashboard`

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      })

      if (signInError) throw signInError

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in encountered an issue. Please try again.'
      setError(message)
      setLoading(false)
    }
  }

  const loginAsDemo = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setUser(DEMO_USER)
      setIsDemo(true)
      localStorage.removeItem(LOGGED_OUT_KEY)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER))
      localStorage.setItem(DEMO_STORAGE_KEY, 'true')
      setLoading(false)
    }, 400)
  }

  const logout = async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut()
      }
    } catch {
      // Ignore signOut network failure on local
    } finally {
      setUser(null)
      setIsDemo(false)
      localStorage.setItem(LOGGED_OUT_KEY, 'true')
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(DEMO_STORAGE_KEY)
      setLoading(false)
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated))

    if (isSupabaseConfigured && !isDemo) {
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: updated.email,
          full_name: updated.fullName,
          university: updated.university,
          graduation_year: updated.graduationYear,
          bio: updated.bio,
          github_url: updated.githubUrl,
          linkedin_url: updated.linkedinUrl,
          role: updated.role,
          track: updated.track,
        })
      } catch (err) {
        console.warn('Supabase profile sync notice:', err)
      }
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isDemo,
        loginWithGoogle,
        loginAsDemo,
        logout,
        updateUserProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
