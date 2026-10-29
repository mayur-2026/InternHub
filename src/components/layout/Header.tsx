import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, Bell, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'

export interface HeaderProps {
  onOpenMobileNav: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { user } = useAuth()
  const { internship } = useApp()

  return (
    <header className="h-[64px] min-h-[64px] bg-white border-b border-[#EDF0F6] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-[#64748B] hover:text-[#25324B] hover:bg-[#F5F7FC] rounded-[8px] min-h-[44px] min-w-[44px] flex items-center justify-center focus-ring cursor-pointer"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Field */}
        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-[#8993A7] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            placeholder="Search topics, projects, resources..."
            className="w-full h-[40px] pl-10 pr-4 bg-[#F5F7FC] border border-[#EDF0F6] rounded-[8px] text-[14px] text-[#25324B] placeholder:text-[#8993A7] focus-ring transition-colors"
          />
        </div>
      </div>

      {/* Right: Active Cohort Badge, Notifications, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Active Track Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3F0FF] text-[#7950F2] text-[12px] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{internship.cohort}</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          className="relative p-2 text-[#64748B] hover:text-[#25324B] hover:bg-[#F5F7FC] rounded-[8px] min-h-[40px] min-w-[40px] flex items-center justify-center focus-ring cursor-pointer"
          aria-label="Notifications (2 unread)"
          title="Notifications"
        >
          <Bell className="w-[19px] h-[19px]" strokeWidth={1.75} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#7950F2] ring-2 ring-white" />
        </button>

        {/* User Avatar with Link to Profile */}
        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#F5F7FC] transition-colors focus-ring min-h-[44px]"
            aria-label="View user profile"
          >
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-[32px] h-[32px] rounded-full object-cover border border-[#EDF0F6]"
            />
            <span className="hidden xl:inline text-[13px] font-semibold text-[#25324B] max-w-[120px] truncate">
              {user.fullName}
            </span>
          </Link>
        )}
      </div>
    </header>
  )
}
