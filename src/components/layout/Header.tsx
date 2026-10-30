import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Sparkles,
  X,
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  FolderGit2,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  User,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'

export interface HeaderProps {
  onOpenMobileNav: () => void
}

interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: 'Sections' | 'Projects' | 'Topics'
  keywords?: string[]
  to: string
  icon: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { user } = useAuth()
  const {
    internship,
    course,
    projects,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useApp()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const searchContainerRef = useRef<HTMLDivElement>(null)
  const notificationsContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Build searchable index from sections, projects, and curriculum topics
  const allSearchItems: SearchItem[] = [
    // 8 Core Navigation Sections
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      subtitle: 'Overview, KPI stats & recent milestones',
      category: 'Sections',
      keywords: ['overview', 'stats', 'kpi', 'metrics', 'home', 'summary'],
      to: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-[#7950F2]" />,
    },
    {
      id: 'nav-internships',
      title: 'My Internships',
      subtitle: `${internship.company} • ${internship.role}`,
      category: 'Sections',
      keywords: ['role', 'company', 'organization', 'dates', 'supervisor', 'fellowship', 'work'],
      to: '/internships',
      icon: <Briefcase className="w-4 h-4 text-[#7950F2]" />,
    },
    {
      id: 'nav-learning',
      title: 'Learning Curriculum',
      subtitle: 'Technical modules, courses & lessons',
      category: 'Sections',
      keywords: ['course', 'modules', 'lessons', 'curriculum', 'study', 'education', 'topics'],
      to: '/learning',
      icon: <GraduationCap className="w-4 h-4 text-[#7950F2]" />,
    },
    {
      id: 'nav-projects',
      title: 'Assigned Projects',
      subtitle: 'Engineering deliverables & submission portal',
      category: 'Sections',
      keywords: ['deliverables', 'sprint', 'code', 'github', 'repository', 'tasks', 'submissions'],
      to: '/projects',
      icon: <FolderGit2 className="w-4 h-4 text-[#F06595]" />,
    },
    {
      id: 'nav-progress',
      title: 'Progress & Analytics',
      subtitle: 'Overall fellowship completion & competencies',
      category: 'Sections',
      keywords: ['analytics', 'charts', 'completion', 'grades', 'attendance', 'metrics'],
      to: '/progress',
      icon: <TrendingUp className="w-4 h-4 text-[#FFB347]" />,
    },
    {
      id: 'nav-feedback',
      title: 'Mentor Feedback & Reviews',
      subtitle: 'Rubric evaluations & weekly retrospectives',
      category: 'Sections',
      keywords: ['reviews', 'mentors', 'retrospective', 'evaluations', 'rubric', 'ratings'],
      to: '/feedback',
      icon: <MessageSquare className="w-4 h-4 text-[#20C997]" />,
    },
    {
      id: 'nav-support',
      title: 'Support & Help Desk',
      subtitle: 'Submit tickets & searchable FAQ answers',
      category: 'Sections',
      keywords: ['help', 'tickets', 'faq', 'issues', 'assistance', 'bugs', 'questions'],
      to: '/support',
      icon: <HelpCircle className="w-4 h-4 text-[#4DABF7]" />,
    },
    {
      id: 'nav-profile',
      title: 'Profile & Settings',
      subtitle: 'Google identity, education & social links',
      category: 'Sections',
      keywords: ['account', 'settings', 'email', 'avatar', 'user', 'google', 'logout'],
      to: '/profile',
      icon: <User className="w-4 h-4 text-[#7950F2]" />,
    },

    // Projects
    ...projects.map((proj) => ({
      id: `proj-${proj.id}`,
      title: proj.title,
      subtitle: `${proj.difficulty} • Due ${proj.dueDate} • Status: ${proj.status}`,
      category: 'Projects' as const,
      keywords: ['project', proj.difficulty.toLowerCase(), proj.status.toLowerCase(), 'submission'],
      to: '/projects',
      icon: <FolderGit2 className="w-4 h-4 text-[#F06595]" />,
    })),

    // Curriculum Topics
    ...course.modules.flatMap((mod) =>
      mod.topics.map((topic) => ({
        id: `topic-${topic.id}`,
        title: topic.title,
        subtitle: `Week ${mod.weekNumber}: ${mod.title} (${topic.durationMinutes} mins)`,
        category: 'Topics' as const,
        keywords: ['lesson', 'topic', `week ${mod.weekNumber}`, mod.title.toLowerCase()],
        to: '/learning',
        icon: <BookOpen className="w-4 h-4 text-[#20C997]" />,
      }))
    ),
  ]

  // Filter matching items
  const trimmedQuery = query.trim().toLowerCase()
  const matchingResults = trimmedQuery
    ? allSearchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(trimmedQuery) ||
          item.subtitle.toLowerCase().includes(trimmedQuery) ||
          item.category.toLowerCase().includes(trimmedQuery) ||
          (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(trimmedQuery)))
      )
    : []

  // Handle clicking outside to close search and notification dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
      if (
        notificationsContainerRef.current &&
        !notificationsContainerRef.current.contains(e.target as Node)
      ) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  const handleSelectResult = (to: string) => {
    navigate(to)
    setQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (matchingResults.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % matchingResults.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (matchingResults.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + matchingResults.length) % matchingResults.length)
      }
    } else if (e.key === 'Enter') {
      if (matchingResults.length > 0 && selectedIndex >= 0 && selectedIndex < matchingResults.length) {
        e.preventDefault()
        handleSelectResult(matchingResults[selectedIndex].to)
      }
    }
  }

  return (
    <header className="h-[64px] min-h-[64px] bg-white border-b border-[#EDF0F6] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu Trigger & Interactive Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-[#64748B] hover:text-[#25324B] hover:bg-[#F5F7FC] rounded-[8px] min-h-[44px] min-w-[44px] flex items-center justify-center focus-ring cursor-pointer"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Field with Interactive Dropdown */}
        <div ref={searchContainerRef} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#8993A7] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              role="searchbox"
              placeholder="Search topics, projects, resources..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setIsOpen(true)
                setSelectedIndex(0)
              }}
              onFocus={() => {
                if (query.trim()) setIsOpen(true)
              }}
              onKeyDown={handleKeyDown}
              className="w-full h-[40px] pl-10 pr-16 bg-[#F5F7FC] border border-[#EDF0F6] rounded-[8px] text-[16px] md:text-[14px] text-[#25324B] placeholder:text-[#8993A7] focus-ring transition-colors"
            />
            <div className="absolute right-2.5 flex items-center gap-1">
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setIsOpen(false)
                    setSelectedIndex(0)
                    inputRef.current?.focus()
                  }}
                  className="p-1 text-[#8993A7] hover:text-[#25324B] rounded-md transition-colors cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block text-[11px] font-medium text-[#8993A7] bg-white border border-[#EDF0F6] px-1.5 py-0.5 rounded shadow-2xs pointer-events-none">
                  Ctrl K
                </kbd>
              )}
            </div>
          </div>

          {/* Search Results Dropdown Panel */}
          {isOpen && trimmedQuery && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#EDF0F6] rounded-[12px] shadow-xl overflow-hidden z-50 max-h-[420px] flex flex-col animate-in fade-in zoom-in-98 duration-100">
              <div className="px-3.5 py-2 border-b border-[#EDF0F6] bg-[#F8FAFF] flex items-center justify-between text-[11px] text-[#8993A7] font-semibold uppercase tracking-wider">
                <span>Search Results ({matchingResults.length})</span>
                <span className="hidden sm:inline">Use ↑↓ to navigate • Enter to select</span>
              </div>

              <div className="overflow-y-auto divide-y divide-[#EDF0F6]/60 flex-1">
                {matchingResults.length === 0 ? (
                  <div className="p-6 text-center text-[#64748B]">
                    <p className="text-[14px] font-semibold text-[#25324B]">No results found</p>
                    <p className="text-[12px] text-[#8993A7] mt-1">
                      No matching sections, projects, or topics for "{query}".
                    </p>
                  </div>
                ) : (
                  matchingResults.map((result, idx) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result.to)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      type="button"
                      className={`w-full px-3.5 py-2.5 text-left flex items-start gap-3 transition-colors cursor-pointer group ${
                        idx === selectedIndex ? 'bg-[#F3F0FF]' : 'hover:bg-[#F3F0FF]/50'
                      }`}
                    >
                      <div className="p-2 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6] group-hover:bg-white group-hover:border-[#7950F2]/20 shrink-0 mt-0.5 transition-colors">
                        {result.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[13px] font-semibold transition-colors truncate ${
                            idx === selectedIndex ? 'text-[#7950F2]' : 'text-[#25324B] group-hover:text-[#7950F2]'
                          }`}>
                            {result.title}
                          </p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                            result.category === 'Sections'
                              ? 'bg-[#F3F0FF] text-[#7950F2] border-[#7950F2]/20'
                              : result.category === 'Projects'
                              ? 'bg-[#FFF0F6] text-[#F06595] border-[#F06595]/20'
                              : 'bg-[#E6FCF5] text-[#0CA678] border-[#20C997]/20'
                          }`}>
                            {result.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                          {result.subtitle}
                        </p>
                      </div>

                      <ArrowRight className={`w-3.5 h-3.5 text-[#7950F2] shrink-0 self-center transition-all ${
                        idx === selectedIndex
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                      }`} />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Active Cohort Badge, Notifications, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Active Track Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3F0FF] text-[#7950F2] text-[12px] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{internship.cohort}</span>
        </div>

        {/* Notifications Icon Button & Interactive Dropdown */}
        <div ref={notificationsContainerRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className={`relative p-2 rounded-[8px] min-h-[40px] min-w-[40px] flex items-center justify-center focus-ring cursor-pointer transition-colors ${
              isNotificationsOpen
                ? 'text-[#7950F2] bg-[#F3F0FF]'
                : 'text-[#64748B] hover:text-[#25324B] hover:bg-[#F5F7FC]'
            }`}
            aria-label={`Notifications (${unreadNotificationsCount} unread)`}
            aria-expanded={isNotificationsOpen}
            title="Notifications"
          >
            <Bell className="w-[19px] h-[19px]" strokeWidth={1.75} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#7950F2] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] bg-white border border-[#EDF0F6] rounded-[12px] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-98 duration-150">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#EDF0F6] bg-[#F8FAFF] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-[#25324B]">Notifications</h3>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F3F0FF] text-[#7950F2] border border-[#7950F2]/20">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-[#7950F2] hover:text-[#6741D9] font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-[#EDE9FF] transition-colors cursor-pointer"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark read</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-[#8993A7] hover:text-[#DC2626] p-1 rounded hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-[#EDF0F6]/60">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#64748B]">
                    <div className="w-10 h-10 rounded-full bg-[#F5F7FC] text-[#8993A7] flex items-center justify-center mx-auto mb-2">
                      <BellOff className="w-5 h-5" />
                    </div>
                    <p className="text-[13px] font-semibold text-[#25324B]">No notifications</p>
                    <p className="text-[12px] text-[#8993A7] mt-0.5">
                      You're all caught up! New updates will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const iconMap = {
                      project: <FolderGit2 className="w-4 h-4 text-[#F06595]" />,
                      curriculum: <GraduationCap className="w-4 h-4 text-[#7950F2]" />,
                      support: <HelpCircle className="w-4 h-4 text-[#4DABF7]" />,
                      feedback: <MessageSquare className="w-4 h-4 text-[#20C997]" />,
                      system: <Sparkles className="w-4 h-4 text-[#7950F2]" />,
                    }

                    const bgMap = {
                      project: 'bg-[#FFF0F6] border-[#F06595]/20',
                      curriculum: 'bg-[#F3F0FF] border-[#7950F2]/20',
                      support: 'bg-[#E7F5FF] border-[#4DABF7]/20',
                      feedback: 'bg-[#E6FCF5] border-[#20C997]/20',
                      system: 'bg-[#F3F0FF] border-[#7950F2]/20',
                    }

                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id)
                          setIsNotificationsOpen(false)
                          if (n.link) navigate(n.link)
                        }}
                        className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                          !n.isRead ? 'bg-[#F8FAFF] hover:bg-[#F3F0FF]/40' : 'bg-white hover:bg-[#F5F7FC]'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-[8px] border shrink-0 mt-0.5 ${
                            bgMap[n.type] || 'bg-[#F5F7FC] border-[#EDF0F6]'
                          }`}
                        >
                          {iconMap[n.type] || <Bell className="w-4 h-4 text-[#7950F2]" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p
                              className={`text-[13px] leading-tight transition-colors ${
                                !n.isRead
                                  ? 'font-bold text-[#25324B] group-hover:text-[#7950F2]'
                                  : 'font-semibold text-[#64748B]'
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#7950F2] shrink-0" />
                            )}
                          </div>
                          <p className="text-[12px] text-[#64748B] mt-1 leading-[18px]">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-[#8993A7] mt-1.5 inline-block font-medium">
                            {n.timestamp}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-2 border-t border-[#EDF0F6] bg-[#F8FAFF] text-center">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(false)
                      navigate('/dashboard')
                    }}
                    className="text-[12px] text-[#7950F2] hover:text-[#6741D9] font-medium py-1 px-2 rounded hover:bg-[#EDE9FF] transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>View all recent activity</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
