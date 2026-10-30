import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { CheckCircle2, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const { user, loginWithGoogle, loginAsDemo, loading, error, clearError } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col justify-center items-center p-4 sm:p-6 text-[#25324B]">
      {/* Container */}
      <div className="w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#7950F2] flex items-center justify-center text-white font-bold text-[20px] shadow-sm">
            IH
          </div>
          <div className="flex flex-col">
            <span className="text-[22px] font-bold leading-[26px] text-[#25324B] tracking-tight">
              Intern<span className="text-[#7950F2]">Hub</span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8993A7]">
              Student Management Portal
            </span>
          </div>
        </div>

        {/* Main Login Card */}
        <Card padding="lg" className="w-full relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#7950F2]" />

          <div className="text-center mb-6">
            <h1 className="text-[22px] font-bold leading-[28px] text-[#25324B]">
              Welcome to InternHub
            </h1>
            <p className="text-[14px] text-[#64748B] mt-1.5 leading-[22px]">
              Sign in with your Google account to access your internship learning path and project workspace.
            </p>
          </div>

          {/* Error Alert if any */}
          {error && (
            <div className="mb-5 p-3.5 bg-[#FEF2F2] border border-[#fecaca] rounded-[8px] flex items-start justify-between gap-2 text-left">
              <p className="text-[13px] text-[#DC2626] leading-[18px]">{error}</p>
              <button
                onClick={clearError}
                className="text-[#DC2626] font-bold text-sm cursor-pointer p-0.5"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="space-y-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center bg-white border-[#EDF0F6] hover:bg-[#F5F7FC] text-[#25324B] font-medium shadow-xs"
              onClick={loginWithGoogle}
              isLoading={loading}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              }
            >
              Continue with Google
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#EDF0F6]"></div>
              <span className="flex-shrink mx-3 text-[12px] text-[#8993A7] uppercase font-medium">
                or
              </span>
              <div className="flex-grow border-t border-[#EDF0F6]"></div>
            </div>

            {/* Quick Demo Student Switcher */}
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              onClick={loginAsDemo}
              isLoading={loading}
              icon={<Sparkles className="w-4 h-4 text-[#FFB347]" />}
            >
              Explore as Demo Student
            </Button>
          </div>

          {/* Secure OAuth Notice */}
          <div className="mt-6 pt-5 border-t border-[#EDF0F6] flex items-center justify-center gap-1.5 text-[12px] text-[#8993A7]">
            <ShieldCheck className="w-4 h-4 text-[#20C997]" />
            <span>Encrypted OAuth 2.0 Session Storage</span>
          </div>
        </Card>

        {/* Feature Highlights Banner */}
        <div className="mt-6 w-full p-4 rounded-[12px] hero-gradient border border-[#7950F2]/15 flex items-start gap-3">
          <div className="w-9 h-9 rounded-[8px] bg-white text-[#7950F2] flex items-center justify-center shrink-0 shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-[12px] leading-[18px]">
            <p className="font-semibold text-[#25324B]">Fall 2026 Engineering Cohort</p>
            <div className="mt-1 flex flex-col space-y-1 text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#20C997]" />
                Interactive curriculum with topic progress tracking
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#20C997]" />
                Direct project review pipelines & mentor feedback
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-[12px] text-[#8993A7] text-center">
          © 2026 InternHub • Built with React 19, TypeScript & Supabase
        </p>
      </div>
    </div>
  )
}

