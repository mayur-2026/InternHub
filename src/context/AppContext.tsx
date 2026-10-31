import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type {
  InternshipInfo,
  Course,
  Project,
  FeedbackEvaluation,
  WeeklyReflection,
  SupportTicket,
  FAQItem,
  TicketCategory,
  TicketPriority,
  AppNotification,
  StreakInfo,
} from '../types'
import {
  INITIAL_INTERNSHIP,
  INITIAL_FAQS,
  CATALOG_COURSE,
  CATALOG_PROJECTS,
  DEMO_USER,
  DEMO_COURSE,
  DEMO_PROJECTS,
  DEMO_FEEDBACK,
  DEMO_REFLECTIONS,
  DEMO_TICKETS,
} from '../data/seedData'
import { useAuth } from './AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { calculateLearningStreak } from '../utils/streak'

interface ToastMessage {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

interface AppContextType {
  internship: InternshipInfo
  course: Course
  projects: Project[]
  feedbackList: FeedbackEvaluation[]
  reflections: WeeklyReflection[]
  tickets: SupportTicket[]
  faqs: FAQItem[]
  toasts: ToastMessage[]
  notifications: AppNotification[]
  unreadNotificationsCount: number
  
  // Analytics & Computed Properties
  totalTopicsCount: number
  completedTopicsCount: number
  curriculumProgressPercentage: number
  overallProgressPercentage: number
  activeProjectsCount: number
  approvedProjectsCount: number
  averageRating: number
  learningStreak: number
  streakInfo: StreakInfo

  // Actions & Mutations
  startProject: (projectId: string) => Promise<boolean>
  toggleTopic: (topicId: string) => Promise<boolean>
  startTopic: (topicId: string) => void
  startedTopicIds: string[]
  submitProject: (projectId: string, data: { repoUrl: string; demoUrl: string; notes: string }) => Promise<void>
  submitWeeklyReflection: (data: { whatWentWell: string; blockers: string; goalsForNextWeek: string }) => Promise<void>
  createTicket: (data: { subject: string; category: TicketCategory; priority: TicketPriority; description: string }) => Promise<void>
  dismissToast: (id: string) => void
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  clearNotifications: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

let toastCounter = 0
function generateToastId() {
  toastCounter += 1
  return `toast_${toastCounter}`
}

function getFormattedTimestamp() {
  return (
    new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' • ' +
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  )
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const AppContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemo } = useAuth()
  const activeStudentId = isDemo ? DEMO_USER.id : (user?.id || 'demo_student')

  const [internship] = useState<InternshipInfo>(INITIAL_INTERNSHIP)

  const [course, setCourse] = useState<Course>(() => {
    const key = isDemo ? 'internhub_demo_course_data' : `internhub_course_${activeStudentId}`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return isDemo ? DEMO_COURSE : CATALOG_COURSE
      }
    }
    return isDemo ? DEMO_COURSE : CATALOG_COURSE
  })

  const [projects, setProjects] = useState<Project[]>(() => {
    const key = isDemo ? 'internhub_demo_projects_data' : `internhub_projects_${activeStudentId}`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return isDemo ? DEMO_PROJECTS : CATALOG_PROJECTS
      }
    }
    return isDemo ? DEMO_PROJECTS : CATALOG_PROJECTS
  })

  const [feedbackList, setFeedbackList] = useState<FeedbackEvaluation[]>(() => {
    if (isDemo) return DEMO_FEEDBACK
    return []
  })

  const [reflections, setReflections] = useState<WeeklyReflection[]>(() => {
    if (isDemo) return DEMO_REFLECTIONS
    const key = `internhub_reflections_${activeStudentId}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    if (isDemo) return DEMO_TICKETS
    const key = `internhub_tickets_${activeStudentId}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const key = `internhub_notifications_${activeStudentId}`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // use default
      }
    }
    return [
      {
        id: 'notif_welcome',
        title: 'Welcome to InternHub',
        message: 'Your internship workspace is active. Explore your curriculum and project milestones.',
        type: 'system',
        timestamp: 'Today',
        isRead: false,
        link: '/dashboard',
      },
      {
        id: 'notif_milestone',
        title: 'Upcoming Milestone Sprint',
        message: 'Review deliverables for InternHub Dashboard and setup your repository.',
        type: 'project',
        timestamp: 'Yesterday',
        isRead: false,
        link: '/projects',
      },
    ]
  })

  // Persisted daily activity timestamps for consistent, timezone-aware streak tracking
  const [persistedActivityTimestamps, setPersistedActivityTimestamps] = useState<string[]>(() => {
    const key = isDemo ? 'internhub_demo_activity_timestamps' : `internhub_activity_timestamps_${activeStudentId}`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  // Track started / in-progress lessons for student engagement
  const [startedTopicIds, setStartedTopicIds] = useState<string[]>(() => {
    const key = isDemo ? 'internhub_demo_started_topics' : `internhub_started_topics_${activeStudentId}`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  const startTopic = (topicId: string) => {
    setStartedTopicIds((prev) => {
      if (prev.includes(topicId)) return prev
      const next = [...prev, topicId]
      const key = isDemo ? 'internhub_demo_started_topics' : `internhub_started_topics_${activeStudentId}`
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(next))
      }
      return next
    })
  }

  // Hydrate records from live Supabase database for authenticated real user
  useEffect(() => {
    if (isDemo || !isSupabaseConfigured || !user) return

    let isMounted = true

    async function hydrateRemoteData() {
      try {
        // 1. Fetch support tickets from Supabase for this authenticated user
        const { data: remoteTickets } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })

        if (isMounted && remoteTickets) {
          const mapped: SupportTicket[] = remoteTickets.map((t) => ({
            id: t.id,
            ticketNumber: t.ticket_number,
            subject: t.subject,
            category: t.category as TicketCategory,
            priority: t.priority as TicketPriority,
            status: (t.status as SupportTicket['status']) || 'Open',
            createdAt: new Date(t.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            description: t.description,
            lastReply: t.last_reply || undefined,
          }))
          setTickets(mapped)
        }

        // 2. Fetch weekly reflections from Supabase for this authenticated user
        const { data: remoteReflections } = await supabase
          .from('weekly_reflections')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })

        if (isMounted && remoteReflections) {
          const mapped: WeeklyReflection[] = remoteReflections.map((r) => ({
            id: r.id,
            weekNumber: r.week_number,
            date: new Date(r.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            createdAtIso: r.created_at,
            whatWentWell: r.what_went_well,
            blockers: r.blockers || '',
            goalsForNextWeek: r.goals_for_next_week,
          }))
          setReflections(mapped)
        }

        // 3. Fetch topic completions from Supabase for this authenticated user
        const { data: remoteCompletions } = await supabase
          .from('topic_completions')
          .select('topic_id, completed_at')
          .eq('student_id', user.id)

        if (isMounted && remoteCompletions && remoteCompletions.length > 0) {
          const compMap = new Map(remoteCompletions.map((c) => [c.topic_id, c.completed_at]))
          setCourse((prevCourse) => ({
            ...prevCourse,
            modules: prevCourse.modules.map((mod) => ({
              ...mod,
              topics: mod.topics.map((t) => {
                const remoteCompletedAt = compMap.get(t.id)
                const isComp = t.isCompleted || compMap.has(t.id)
                return {
                  ...t,
                  isCompleted: isComp,
                  completedAt: remoteCompletedAt || (isComp ? t.completedAt || new Date().toISOString() : undefined),
                }
              }),
            })),
          }))
        }

        // 4. Fetch project submissions from Supabase for this authenticated user
        const { data: remoteSubmissions } = await supabase
          .from('project_submissions')
          .select('*')
          .eq('student_id', user.id)

        if (isMounted && remoteSubmissions && remoteSubmissions.length > 0) {
          const subMap = new Map(remoteSubmissions.map((s) => [s.project_id, s]))
          setProjects((prevProjects) =>
            prevProjects.map((p) => {
              const remoteSub = subMap.get(p.id)
              if (remoteSub) {
                const isStartedOnly =
                  remoteSub.status === 'In Progress' && !remoteSub.repo_url && !remoteSub.demo_url
                const startedAtTimestamp =
                  remoteSub.started_at ||
                  (remoteSub.notes?.startsWith('started_at:')
                    ? remoteSub.notes.replace('started_at:', '')
                    : undefined)

                return {
                  ...p,
                  status: (remoteSub.status as Project['status']) || 'Under Review',
                  startedAt: startedAtTimestamp,
                  submission: isStartedOnly
                    ? undefined
                    : {
                        repoUrl: remoteSub.repo_url,
                        demoUrl: remoteSub.demo_url,
                        notes: remoteSub.notes || '',
                        submittedAt: new Date(remoteSub.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }),
                        submittedAtIso: remoteSub.submitted_at,
                        grade: remoteSub.grade || undefined,
                        mentorFeedback: remoteSub.mentor_feedback || undefined,
                      },
                }
              }
              return p
            })
          )

          // Derive genuine mentor feedback from graded submissions
          const subsWithFeedback = remoteSubmissions.filter((s) => s.mentor_feedback || s.grade)
          if (subsWithFeedback.length > 0) {
            const newFeedback: FeedbackEvaluation[] = subsWithFeedback.map((s) => {
              const proj = CATALOG_PROJECTS.find((p) => p.id === s.project_id)
              return {
                id: `fb_${s.id}`,
                mentorName: 'Dr. Sarah Lin',
                mentorRole: 'Staff Architect & Lead Mentor',
                mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
                date: new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                overallRating: s.grade ? Number((s.grade / 20).toFixed(1)) : 4.8,
                criteria: {
                  codeQuality: 5.0,
                  architecture: 4.8,
                  uiux: 4.9,
                  communication: 4.8,
                },
                projectName: proj?.title || 'Assigned Project',
                comments: s.mentor_feedback || 'Deliverable successfully reviewed and approved.',
              }
            })
            setFeedbackList(newFeedback)
          } else {
            setFeedbackList([])
          }
        }

        // 5. Aggregate all remote qualifying learning activity timestamps for persistent streak tracking
        if (isMounted) {
          const remoteTimestamps: string[] = []
          if (remoteCompletions) {
            for (const c of remoteCompletions) {
              if (c.completed_at) remoteTimestamps.push(c.completed_at)
            }
          }
          if (remoteSubmissions) {
            for (const s of remoteSubmissions) {
              if (s.submitted_at) remoteTimestamps.push(s.submitted_at)
            }
          }
          if (remoteReflections) {
            for (const r of remoteReflections) {
              if (r.created_at) remoteTimestamps.push(r.created_at)
            }
          }
          if (remoteTimestamps.length > 0) {
            setPersistedActivityTimestamps((prev) => Array.from(new Set([...prev, ...remoteTimestamps])))
          }
        }
      } catch (err) {
        console.warn('Supabase data hydration notice:', err)
      }
    }

    hydrateRemoteData()

    return () => {
      isMounted = false
    }
  }, [user, isDemo])

  // Supabase Realtime channel subscription for live cross-device / mentor synchronization
  useEffect(() => {
    if (isDemo || !isSupabaseConfigured || !user) return

    const channel = supabase
      .channel(`rt_project_submissions_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_submissions',
          filter: `student_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as {
              project_id: string
              status: string
              repo_url?: string
              demo_url?: string
              notes?: string
              submitted_at?: string
              started_at?: string
              grade?: number
              mentor_feedback?: string
            }

            if (!row || !row.project_id) return

            const isStartedOnly =
              row.status === 'In Progress' && !row.repo_url && !row.demo_url
            const startedAtTimestamp =
              row.started_at ||
              (row.notes?.startsWith('started_at:')
                ? row.notes.replace('started_at:', '')
                : undefined)

            setProjects((prev) =>
              prev.map((p) => {
                if (p.id === row.project_id) {
                  return {
                    ...p,
                    status: (row.status as Project['status']) || p.status,
                    startedAt: startedAtTimestamp || p.startedAt,
                    submission: isStartedOnly
                      ? undefined
                      : {
                          repoUrl: row.repo_url || '',
                          demoUrl: row.demo_url || '',
                          notes: row.notes || '',
                          submittedAt: row.submitted_at
                            ? new Date(row.submitted_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Recently',
                          submittedAtIso: row.submitted_at,
                          grade: row.grade || undefined,
                          mentorFeedback: row.mentor_feedback || undefined,
                        },
                  }
                }
                return p
              })
            )
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as { project_id?: string }
            if (oldRow?.project_id) {
              setProjects((prev) =>
                prev.map((p) =>
                  p.id === oldRow.project_id
                    ? { ...p, status: 'Not Started', submission: undefined, startedAt: undefined }
                    : p
                )
              )
            }
          }
        }
      )
      .subscribe()

    // Realtime subscription for live topic completion across sessions
    const topicChannel = supabase
      .channel(`rt_topic_completions_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'topic_completions',
          filter: `student_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const row = payload.new as { topic_id?: string; completed_at?: string }
            if (row?.topic_id) {
              const compTopicId = row.topic_id
              const compTimestamp = row.completed_at || new Date().toISOString()
              setCourse((prevCourse) => ({
                ...prevCourse,
                modules: prevCourse.modules.map((mod) => ({
                  ...mod,
                  topics: mod.topics.map((t) =>
                    t.id === compTopicId ? { ...t, isCompleted: true, completedAt: compTimestamp } : t
                  ),
                })),
              }))
              setPersistedActivityTimestamps((prev) => Array.from(new Set([...prev, compTimestamp])))
            }
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as { topic_id?: string }
            if (oldRow?.topic_id) {
              const uncompTopicId = oldRow.topic_id
              setCourse((prevCourse) => ({
                ...prevCourse,
                modules: prevCourse.modules.map((mod) => ({
                  ...mod,
                  topics: mod.topics.map((t) =>
                    t.id === uncompTopicId ? { ...t, isCompleted: false, completedAt: undefined } : t
                  ),
                })),
              }))
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(topicChannel)
    }
  }, [user, isDemo])

  // Sync to local storage
  useEffect(() => {
    const key = isDemo ? 'internhub_demo_course_data' : `internhub_course_${activeStudentId}`
    localStorage.setItem(key, JSON.stringify(course))
  }, [course, activeStudentId, isDemo])

  useEffect(() => {
    const key = isDemo ? 'internhub_demo_projects_data' : `internhub_projects_${activeStudentId}`
    localStorage.setItem(key, JSON.stringify(projects))
  }, [projects, activeStudentId, isDemo])

  useEffect(() => {
    const key = isDemo ? 'internhub_demo_reflections_data' : `internhub_reflections_${activeStudentId}`
    localStorage.setItem(key, JSON.stringify(reflections))
  }, [reflections, activeStudentId, isDemo])

  useEffect(() => {
    const key = isDemo ? 'internhub_demo_tickets_data' : `internhub_tickets_${activeStudentId}`
    localStorage.setItem(key, JSON.stringify(tickets))
  }, [tickets, activeStudentId, isDemo])

  useEffect(() => {
    const key = isDemo ? 'internhub_demo_notifications_data' : `internhub_notifications_${activeStudentId}`
    localStorage.setItem(key, JSON.stringify(notifications))
  }, [notifications, activeStudentId, isDemo])

  useEffect(() => {
    const key = isDemo ? 'internhub_demo_activity_timestamps' : `internhub_activity_timestamps_${activeStudentId}`
    localStorage.setItem(key, JSON.stringify(persistedActivityTimestamps))
  }, [persistedActivityTimestamps, activeStudentId, isDemo])

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = generateToastId()
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      dismissToast(id)
    }, 4000)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Computed Values
  const allTopics = course.modules.flatMap((m) => m.topics)
  const totalTopicsCount = allTopics.length
  const completedTopicsCount = allTopics.filter((t) => t.isCompleted).length
  const curriculumProgressPercentage = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0

  const activeProjectsCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Under Review').length
  const approvedProjectsCount = projects.filter((p) => p.status === 'Approved').length

  // Weighted overall progress: 60% curriculum + 40% approved projects
  const projectProgressFraction = projects.length > 0 ? (approvedProjectsCount / projects.length) : 0
  const overallProgressPercentage = Math.round(
    (curriculumProgressPercentage * 0.6) + (projectProgressFraction * 100 * 0.4)
  )

  const averageRating = feedbackList.length > 0
    ? Number((feedbackList.reduce((acc, f) => acc + f.overallRating, 0) / feedbackList.length).toFixed(1))
    : 0

  // Combine all persisted qualifying learning activity timestamps (topics, projects, weekly reflections)
  const allActivityTimestamps = useMemo(() => {
    const timestamps = new Set<string>(persistedActivityTimestamps)

    for (const mod of course.modules) {
      for (const top of mod.topics) {
        if (top.isCompleted && top.completedAt) {
          timestamps.add(top.completedAt)
        }
      }
    }

    for (const proj of projects) {
      if (proj.submission?.submittedAtIso) {
        timestamps.add(proj.submission.submittedAtIso)
      }
    }

    for (const ref of reflections) {
      if (ref.createdAtIso) {
        timestamps.add(ref.createdAtIso)
      }
    }

    return Array.from(timestamps)
  }, [persistedActivityTimestamps, course, projects, reflections])

  // Production-grade streak calculation using timezone awareness and consecutive day stepping
  const streakInfo = useMemo(() => {
    return calculateLearningStreak(allActivityTimestamps)
  }, [allActivityTimestamps])

  const learningStreak = isDemo ? 14 : streakInfo.currentStreak

  // Topic Completion Toggle (Optimistic Update + Supabase Background Sync)
  const toggleTopic = async (topicId: string): Promise<boolean> => {
    const targetTopic = course.modules.flatMap((m) => m.topics).find((t) => t.id === topicId)
    const willBeCompleted = targetTopic ? !targetTopic.isCompleted : false
    const nowIso = new Date().toISOString()
    startTopic(topicId)

    setCourse((prevCourse) => {
      const nextModules = prevCourse.modules.map((mod) => {
        const nextTopics = mod.topics.map((top) => {
          if (top.id === topicId) {
            return {
              ...top,
              isCompleted: willBeCompleted,
              completedAt: willBeCompleted ? nowIso : undefined,
            }
          }
          return top
        })
        return { ...mod, topics: nextTopics }
      })
      return { ...prevCourse, modules: nextModules }
    })

    if (willBeCompleted) {
      setPersistedActivityTimestamps((prev) => Array.from(new Set([...prev, nowIso])))
    }

    if (isSupabaseConfigured && user && !isDemo) {
      try {
        if (willBeCompleted) {
          const { error: syncError } = await supabase.from('topic_completions').upsert(
            { student_id: activeStudentId, topic_id: topicId, completed_at: nowIso },
            { onConflict: 'student_id,topic_id' }
          )
          if (syncError) {
            console.error('Supabase topic completion sync error:', syncError)
            showToast('Database Sync Error', syncError.message, 'error')
          } else {
            showToast('Topic Completed', 'Your progress has been recorded in Supabase!', 'success')
          }
        } else {
          const { error: syncError } = await supabase
            .from('topic_completions')
            .delete()
            .match({ student_id: activeStudentId, topic_id: topicId })
          if (syncError) {
            console.error('Supabase topic completion delete error:', syncError)
          }
        }
      } catch (err) {
        console.error('Supabase topic completion sync notice:', err)
      }
    } else if (willBeCompleted) {
      showToast('Topic Completed', 'Your curriculum progress has been updated!', 'success')
    }

    if (willBeCompleted && targetTopic) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Topic Completed',
          message: `Completed "${targetTopic.title}". Curriculum progress updated!`,
          type: 'curriculum',
          timestamp: 'Just now',
          isRead: false,
          link: '/learning',
        },
        ...prev,
      ])
    }

    return true
  }

  // Start Project (Transitions from Not Started to In Progress with Supabase Persistence)
  const startProject = async (projectId: string): Promise<boolean> => {
    const targetProject = projects.find((p) => p.id === projectId)
    if (!targetProject) return false

    // Prevent duplicate start requests if already started or in flight
    if (targetProject.status !== 'Not Started' && (targetProject.status as string) !== 'assigned') {
      return true
    }

    const nowIso = new Date().toISOString()
    if (isSupabaseConfigured && user && !isDemo) {
      try {
        const payload = {
          project_id: projectId,
          student_id: activeStudentId,
          repo_url: '',
          demo_url: '',
          status: 'In Progress',
          started_at: nowIso,
        }

        let { error: startError } = await supabase
          .from('project_submissions')
          .upsert(payload, { onConflict: 'student_id,project_id' })

        // Graceful fallback if started_at column is not yet present in Supabase schema
        if (startError && startError.code === 'PGRST204') {
          const fallbackPayload = {
            project_id: projectId,
            student_id: activeStudentId,
            repo_url: '',
            demo_url: '',
            status: 'In Progress',
            notes: `started_at:${nowIso}`,
          }
          const fbResult = await supabase
            .from('project_submissions')
            .upsert(fallbackPayload, { onConflict: 'student_id,project_id' })
          startError = fbResult.error
        }

        if (startError) {
          console.error('Supabase start project error:', startError)
          showToast('Database Sync Error', startError.message || 'Could not start project in Supabase', 'error')
          return false
        }
      } catch (err) {
        console.error('Supabase start project notice:', err)
        showToast('Network Error', 'Failed to communicate with database', 'error')
        return false
      }
    }

    // Persist update in state & activity timestamps
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            status: 'In Progress',
            startedAt: nowIso,
          }
        }
        return proj
      })
    )

    setPersistedActivityTimestamps((prev) => Array.from(new Set([...prev, nowIso])))

    showToast('Project Started', `"${targetProject.title}" is now In Progress!`, 'success')

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Project Started',
        message: `Started sprint for "${targetProject.title}". Status: In Progress.`,
        type: 'project',
        timestamp: 'Just now',
        isRead: false,
        link: '/projects',
      },
      ...prev,
    ])

    return true
  }

  // Project Submission (Optimistic Update + Supabase Background Sync)
  const submitProject = async (
    projectId: string,
    data: { repoUrl: string; demoUrl: string; notes: string }
  ) => {
    const timestamp = getFormattedTimestamp()
    const nowIso = new Date().toISOString()
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            status: 'Under Review',
            submission: {
              repoUrl: data.repoUrl,
              demoUrl: data.demoUrl,
              notes: data.notes,
              submittedAt: timestamp,
              submittedAtIso: nowIso,
            },
          }
        }
        return proj
      })
    )

    setPersistedActivityTimestamps((prev) => Array.from(new Set([...prev, nowIso])))

    if (isSupabaseConfigured && user && !isDemo) {
      try {
        const { error: syncError } = await supabase.from('project_submissions').upsert(
          {
            project_id: projectId,
            student_id: activeStudentId,
            repo_url: data.repoUrl,
            demo_url: data.demoUrl,
            notes: data.notes,
            status: 'Under Review',
            submitted_at: nowIso,
          },
          { onConflict: 'student_id,project_id' }
        )
        if (syncError) {
          console.error('Supabase project submission sync error:', syncError)
          showToast('Database Sync Error', syncError.message, 'error')
        } else {
          showToast('Project Submitted', 'Your deliverables are now recorded in Supabase!', 'success')
        }
      } catch (err) {
        console.error('Supabase project submission sync notice:', err)
      }
    } else {
      showToast('Project Submitted', 'Your deliverables are now under mentor review.', 'success')
    }

    const targetProject = projects.find((p) => p.id === projectId)
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Deliverables Submitted',
        message: `Submitted deliverables for "${targetProject?.title || 'Project'}". Status: Under Review.`,
        type: 'project',
        timestamp: 'Just now',
        isRead: false,
        link: '/projects',
      },
      ...prev,
    ])
  }

  // Submit Weekly Reflection (Optimistic Update + Supabase Direct Insert)
  const submitWeeklyReflection = async (data: { whatWentWell: string; blockers: string; goalsForNextWeek: string }) => {
    const weekNum = reflections.length + 1
    const nowIso = new Date().toISOString()
    const newRef: WeeklyReflection = {
      id: 'ref_' + generateToastId(),
      weekNumber: weekNum,
      date: getFormattedDate(),
      createdAtIso: nowIso,
      whatWentWell: data.whatWentWell,
      blockers: data.blockers,
      goalsForNextWeek: data.goalsForNextWeek,
    }
    setReflections((prev) => [newRef, ...prev])
    setPersistedActivityTimestamps((prev) => Array.from(new Set([...prev, nowIso])))
    showToast('Reflection Saved', 'Your weekly retrospective has been recorded.', 'success')

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Weekly Retrospective Recorded',
        message: `Week ${weekNum} self-reflection has been saved.`,
        type: 'feedback',
        timestamp: 'Just now',
        isRead: false,
        link: '/feedback',
      },
      ...prev,
    ])

    if (isSupabaseConfigured && user && !isDemo) {
      try {
        await supabase.from('weekly_reflections').insert({
          student_id: activeStudentId,
          week_number: weekNum,
          what_went_well: data.whatWentWell,
          blockers: data.blockers,
          goals_for_next_week: data.goalsForNextWeek,
          created_at: nowIso,
        })
      } catch (err) {
        console.warn('Supabase reflection sync notice:', err)
      }
    }
  }

  // Create Support Ticket (Optimistic Update + Supabase Direct Insert)
  const createTicket = async (data: { subject: string; category: TicketCategory; priority: TicketPriority; description: string }) => {
    const nextNum = 'TKT-' + (1000 + tickets.length + 1)
    const newTicket: SupportTicket = {
      id: 'tkt_' + generateToastId(),
      ticketNumber: nextNum,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'Open',
      createdAt: getFormattedTimestamp(),
      description: data.description,
    }
    setTickets((prev) => [newTicket, ...prev])
    showToast('Ticket Opened', `Ticket ${nextNum} has been created and assigned to support.`, 'info')

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Support Ticket Logged',
        message: `Ticket #${nextNum} (${data.category}) created and assigned.`,
        type: 'support',
        timestamp: 'Just now',
        isRead: false,
        link: '/support',
      },
      ...prev,
    ])

    if (isSupabaseConfigured && user && !isDemo) {
      try {
        await supabase.from('support_tickets').insert({
          student_id: activeStudentId,
          ticket_number: nextNum,
          subject: data.subject,
          category: data.category,
          priority: data.priority,
          status: 'Open',
          description: data.description,
        })
      } catch (err) {
        console.warn('Supabase ticket creation sync notice:', err)
      }
    }
  }

  return (
    <AppContext.Provider
      value={{
        internship,
        course,
        projects,
        feedbackList,
        reflections,
        tickets,
        faqs,
        toasts,
        notifications,
        unreadNotificationsCount,
        totalTopicsCount,
        completedTopicsCount,
        curriculumProgressPercentage,
        overallProgressPercentage,
        activeProjectsCount,
        approvedProjectsCount,
        averageRating,
        learningStreak,
        streakInfo,
        startProject,
        toggleTopic,
        startTopic,
        startedTopicIds,
        submitProject,
        submitWeeklyReflection,
        createTicket,
        dismissToast,
        showToast,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemo } = useAuth()
  const instanceKey = isDemo ? 'demo_session' : (user?.id || 'guest_session')

  return <AppContentProvider key={instanceKey}>{children}</AppContentProvider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
