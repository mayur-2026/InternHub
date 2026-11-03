import React, { useState, useRef, useEffect, useMemo } from 'react'
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
  ArrowRight,
  FolderGit2,
  GraduationCap,
  HelpCircle,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import type { NotificationType } from '../../types'
import { buildSearchIndex } from './searchIndex'

export interface HeaderProps {
  onOpenMobileNav: () => void
}

function getNotificationVisual(type: NotificationType) {
  switch (type) {
    case 'project':
      return {
        icon: <FolderGit2 className="w-4 h-4 text-[#F06595]" />,
        containerClass: 'bg-[#FFF0F6] border-[#F06595]/20',
      }
    case 'curriculum':
      return {
        icon: <GraduationCap className="w-4 h-4 text-[#7950F2]" />,
        containerClass: 'bg-[#F3F0FF] border-[#7950F2]/20',
      }
    case 'support':
      return {
        icon: <HelpCircle className="w-4 h-4 text-[#4DABF7]" />,
        containerClass: 'bg-[#E7F5FF] border-[#4DABF7]/20',
      }
    case 'feedback':
      return {
        icon: <MessageSquare className="w-4 h-4 text-[#20C997]" />,
        containerClass: 'bg-[#E6FCF5] border-[#20C997]/20',
      }
    case 'system':
    default:
      return {
        icon: <Sparkles className="w-4 h-4 text-[#7950F2]" />,
        containerClass: 'bg-[#F3F0FF] border-[#7950F2]/20',
      }
  }
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

  // Construct indexed search items
  const allSearchItems = useMemo(() => {
    return buildSearchIndex(internship, projects, course)
  }, [internship, projects, course])

  const trimmedQuery = query.trim().toLowerCase()

  const matchingResults = useMemo(() => {
    if (!trimmedQuery) return []
    return allSearchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmedQuery) ||
        item.subtitle.toLowerCase().includes(trimmedQuery) ||
        item.category.toLowerCase().includes(trimmedQuery) ||
        (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(trimmedQuery)))
    )
  }, [allSearchItems, trimmedQuery])

  // Dismiss dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const targetNode = e.target as Node
      if (searchContainerRef.current && !searchContainerRef.current.contains(targetNode)) {
        setIsOpen(false)
      }
      if (notificationsContainerRef.current && !notificationsContainerRef.current.contains(targetNode)) {
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

  const handleSelectResult = (targetPath: string) => {
    navigate(targetPath)
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
      {/* Search Input and Mobile Trigger */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-[#64748B] hover:text-[#25324B] hover:bg-[#F5F7FC] rounded-[8px] min-h-[44px] min-w-[44px] flex items-center justify-center focus-ring cursor-pointer"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

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
                          <p
                            className={`text-[13px] font-semibold transition-colors truncate ${
                              idx === selectedIndex ? 'text-[#7950F2]' : 'text-[#25324B] group-hover:text-[#7950F2]'
                            }`}
                          >
                            {result.title}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                              result.category === 'Sections'
                                ? 'bg-[#F3F0FF] text-[#7950F2] border-[#7950F2]/20'
                                : result.category === 'Projects'
                                ? 'bg-[#FFF0F6] text-[#F06595] border-[#F06595]/20'
                                : 'bg-[#E6FCF5] text-[#0CA678] border-[#20C997]/20'
                            }`}
                          >
                            {result.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] truncate mt-0.5">{result.subtitle}</p>
                      </div>

                      <ArrowRight
                        className={`w-3.5 h-3.5 text-[#7950F2] shrink-0 self-center transition-all ${
                          idx === selectedIndex
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                        }`}
                      />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cohort Badge, Notifications, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3F0FF] text-[#7950F2] text-[12px] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{internship.cohort}</span>
        </div>

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

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] bg-white border border-[#EDF0F6] rounded-[12px] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-98 duration-150">
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
                  notifications.map((notification) => {
                    const visual = getNotificationVisual(notification.type)
                    return (
                      <div
                        key={notification.id}
                        onClick={() => {
                          markNotificationAsRead(notification.id)
                          setIsNotificationsOpen(false)
                          if (notification.link) navigate(notification.link)
                        }}
                        className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                          !notification.isRead ? 'bg-[#F8FAFF] hover:bg-[#F3F0FF]/40' : 'bg-white hover:bg-[#F5F7FC]'
                        }`}
                      >
                        <div className={`p-2 rounded-[8px] border shrink-0 mt-0.5 ${visual.containerClass}`}>
                          {visual.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p
                              className={`text-[13px] leading-tight transition-colors ${
                                !notification.isRead
                                  ? 'font-bold text-[#25324B] group-hover:text-[#7950F2]'
                                  : 'font-semibold text-[#64748B]'
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#7950F2] shrink-0" />
                            )}
                          </div>
                          <p className="text-[12px] text-[#64748B] mt-1 leading-[18px]">
                            {notification.message}
                          </p>
                          <span className="text-[10px] text-[#8993A7] mt-1.5 inline-block font-medium">
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

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
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
