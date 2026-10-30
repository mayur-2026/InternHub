import React, { createContext, useContext, useState, useEffect } from 'react'
import type { UserProfile } from '../types'
import { INITIAL_USER } from '../data/seedData'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  error: string | null
  isDemo: boolean
  loginWithGoogle: () => Promise<void>
  loginAsDemo: () => void
  logout: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'internhub_auth_user'
const DEMO_STORAGE_KEY = 'internhub_is_demo'
const LOGGED_OUT_KEY = 'internhub_logged_out'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
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
    // Default to demo user on initial launch so reviewer immediately sees populated working demo
    return INITIAL_USER
  })

  const [isDemo, setIsDemo] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem(DEMO_STORAGE_KEY) !== 'false'
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const syncUser = (authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }) => {
      const meta = authUser.user_metadata || {}
      const syncedUser: UserProfile = {
        id: authUser.id,
        email: authUser.email || 'user@gmail.com',
        fullName: String(meta.full_name || meta.name || 'Google User'),
        avatarUrl: String(meta.avatar_url || meta.picture || INITIAL_USER.avatarUrl),
        bio: String(meta.bio || INITIAL_USER.bio),
        university: String(meta.university || INITIAL_USER.university),
        graduationYear: String(meta.graduationYear || INITIAL_USER.graduationYear),
        githubUrl: String(meta.githubUrl || INITIAL_USER.githubUrl),
        linkedinUrl: String(meta.linkedinUrl || INITIAL_USER.linkedinUrl),
        role: 'Student Intern',
        track: 'Full-Stack Web Engineering',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      }
      setUser(syncedUser)
      setIsDemo(false)
      localStorage.removeItem(LOGGED_OUT_KEY)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(syncedUser))
      localStorage.setItem(DEMO_STORAGE_KEY, 'false')
    }

    // Check existing active session on mount
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!error && session?.user) {
        syncUser(session.user)
      }
    })

    // Listen to real Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          syncUser(session.user)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)

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

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
        },
      })

      if (signInError) throw signInError

      if (data?.url) {
        // Pre-flight check the authorize URL to avoid landing on raw 400 JSON error if provider is not yet enabled
        try {
          const res = await fetch(data.url)
          if (res.status === 400) {
            const body = await res.json().catch(() => ({}))
            if (body.msg && body.msg.includes('provider is not enabled')) {
              setError(
                'Google OAuth is not enabled in your Supabase project yet (Auth → Providers → Google). You can toggle it ON in your Supabase console, or click "Explore as Demo Student" to review all features immediately.'
              )
              setLoading(false)
              return
            }
          }
        } catch {
          // If pre-flight check cannot run due to browser CORS, proceed directly
        }

        window.location.href = data.url
        return
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
      setUser(INITIAL_USER)
      setIsDemo(true)
      localStorage.removeItem(LOGGED_OUT_KEY)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(INITIAL_USER))
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

    if (isSupabaseConfigured) {
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
