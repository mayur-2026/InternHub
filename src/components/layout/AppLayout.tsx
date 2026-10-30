import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileDrawer } from './MobileDrawer'
import { ToastContainer } from '../ui/ToastContainer'

export const AppLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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

