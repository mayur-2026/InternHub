import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  FolderGit2,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'

interface NavItem {
  name: string
  to: string
  icon: React.ReactNode
  badge?: string
}

export const Sidebar: React.FC<{ onItemClick?: () => void }> = ({ onItemClick }) => {
  const { user, logout, isDemo } = useAuth()
  const { activeProjectsCount } = useApp()

  const navItems: NavItem[] = [
    { name: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-[19px] h-[19px]" strokeWidth={1.75} /> },
    { name: 'My Internships', to: '/internships', icon: <Briefcase className="w-[19px] h-[19px]" strokeWidth={1.75} /> },
    { name: 'Learning', to: '/learning', icon: <GraduationCap className="w-[19px] h-[19px]" strokeWidth={1.75} />, badge: 'Active' },
    {
      name: 'Projects',
      to: '/projects',
      icon: <FolderGit2 className="w-[19px] h-[19px]" strokeWidth={1.75} />,
      badge: activeProjectsCount > 0 ? `${activeProjectsCount} Due` : undefined,
    },
    { name: 'Progress', to: '/progress', icon: <TrendingUp className="w-[19px] h-[19px]" strokeWidth={1.75} /> },
    { name: 'Feedback', to: '/feedback', icon: <MessageSquare className="w-[19px] h-[19px]" strokeWidth={1.75} /> },
    { name: 'Support', to: '/support', icon: <HelpCircle className="w-[19px] h-[19px]" strokeWidth={1.75} /> },
    { name: 'Profile', to: '/profile', icon: <User className="w-[19px] h-[19px]" strokeWidth={1.75} /> },
  ]

  return (
    <aside className="w-[240px] h-full flex flex-col bg-white border-r border-[#EDF0F6] select-none">
      {/* Brand Logo Header */}
      <div className="h-[64px] min-h-[64px] px-5 flex items-center gap-2.5 border-b border-[#EDF0F6]">
        <div className="w-[32px] h-[32px] rounded-[8px] bg-[#7950F2] flex items-center justify-center text-white font-bold text-[16px] shadow-sm">
          IH
        </div>
        <div className="flex flex-col">
          <span className="text-[18px] font-bold leading-[24px] text-[#25324B] tracking-tight">
            Intern<span className="text-[#7950F2]">Hub</span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#8993A7] -mt-1">
            Student Portal
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8993A7]">
          Main Navigation
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 min-h-[40px] rounded-[8px] text-[14px] font-medium leading-[20px] transition-all duration-150 focus-ring ${
                isActive
                  ? 'bg-[#F3F0FF] text-[#7950F2] font-semibold'
                  : 'text-[#64748B] hover:text-[#25324B] hover:bg-[#F5F7FC]'
              }`
            }
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#E7F5FF] text-[#1864AB]">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* Demo Mode Badge notice if in demo mode */}
        {isDemo && (
          <div className="pt-4 px-2">
            <div className="p-3 bg-[#F3F0FF] border border-[#7950F2]/20 rounded-[10px] flex items-start gap-2 text-[#7950F2]">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-[15px]">
                <p className="font-semibold">Interactive Demo</p>
                <p className="text-[#64748B] text-[10px] mt-0.5">Google OAuth & state simulated in browser.</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Profile Mini-Card */}
      {user && (
        <div className="p-3 border-t border-[#EDF0F6] bg-white">
          <div className="p-2 rounded-[8px] bg-[#F5F7FC] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-[32px] h-[32px] rounded-full object-cover shrink-0 border border-white shadow-xs"
              />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#25324B] truncate leading-[16px]">
                  {user.fullName}
                </p>
                <p className="text-[11px] text-[#8993A7] truncate leading-[14px]">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 text-[#8993A7] hover:text-[#DC2626] hover:bg-white rounded-md transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center focus-ring"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
