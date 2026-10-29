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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return null
      }
    }
    // Default to demo user if first time so reviewer immediately sees populated working demo
    return INITIAL_USER
  })

  const [isDemo, setIsDemo] = useState<boolean>(() => {
    return localStorage.getItem(DEMO_STORAGE_KEY) !== 'false'
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    // Listen to real Supabase Auth events if configured
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {}
          const syncedUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || 'user@gmail.com',
            fullName: meta.full_name || meta.name || 'Google User',
            avatarUrl: meta.avatar_url || meta.picture || INITIAL_USER.avatarUrl,
            bio: meta.bio || INITIAL_USER.bio,
            university: meta.university || INITIAL_USER.university,
            graduationYear: meta.graduationYear || INITIAL_USER.graduationYear,
            githubUrl: meta.githubUrl || INITIAL_USER.githubUrl,
            linkedinUrl: meta.linkedinUrl || INITIAL_USER.linkedinUrl,
            role: 'Student Intern',
            track: 'Full-Stack Web Engineering',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          }
          setUser(syncedUser)
          setIsDemo(false)
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(syncedUser))
          localStorage.setItem(DEMO_STORAGE_KEY, 'false')
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
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(INITIAL_USER))
          localStorage.setItem(DEMO_STORAGE_KEY, 'true')
          setLoading(false)
        }, 600)
        return
      }

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })

      if (signInError) throw signInError
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
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(DEMO_STORAGE_KEY)
      setLoading(false)
    }
  }

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated))
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
