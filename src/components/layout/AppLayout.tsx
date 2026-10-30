import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileDrawer } from './MobileDrawer'
import { ToastContainer } from '../ui/ToastContainer'
import { useAuth } from '../../context/AuthContext'
import { Sparkles, ArrowRight } from 'lucide-react'

export const AppLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { isDemo, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex text-[#25324B] antialiased">
      {/* Desktop Persistent Sidebar (≥ 1024px) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-20">
        <Sidebar />
      </div>

      {/* Mobile Drawer (< 1024px) */}
      <MobileDrawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Subtle Demo Banner */}
        {isDemo && (
          <div className="bg-[#7950F2] text-white px-4 py-2 text-[12px] flex items-center justify-between shadow-xs z-30">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Demo Mode
              </span>
              <span className="truncate">
                Viewing sample student workspace for Alex Rivera. Connect your personal Google account for live Supabase sync.
              </span>
            </div>
            <Link
              to="/login"
              onClick={() => logout()}
              className="text-white underline font-semibold hover:text-[#E7F5FF] shrink-0 ml-3 flex items-center gap-1 text-[11px]"
            >
              Sign In with Google <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Interactive Toast Notification Container */}
      <ToastContainer />
    </div>
  )
}

