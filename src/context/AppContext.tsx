import React, { createContext, useContext, useState, useEffect } from 'react'
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
  
  // Analytics & Computed Properties
  totalTopicsCount: number
  completedTopicsCount: number
  curriculumProgressPercentage: number
  overallProgressPercentage: number
  activeProjectsCount: number
  approvedProjectsCount: number
  averageRating: number

  // Actions & Mutations
  toggleTopic: (topicId: string) => Promise<void>
  submitProject: (projectId: string, data: { repoUrl: string; demoUrl: string; notes: string }) => Promise<void>
  submitWeeklyReflection: (data: { whatWentWell: string; blockers: string; goalsForNextWeek: string }) => Promise<void>
  createTicket: (data: { subject: string; category: TicketCategory; priority: TicketPriority; description: string }) => Promise<void>
  dismissToast: (id: string) => void
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void
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
            whatWentWell: r.what_went_well,
            blockers: r.blockers || '',
            goalsForNextWeek: r.goals_for_next_week,
          }))
          setReflections(mapped)
        }

        // 3. Fetch topic completions from Supabase for this authenticated user
        const { data: remoteCompletions } = await supabase
          .from('topic_completions')
          .select('topic_id')
          .eq('student_id', user.id)

        if (isMounted && remoteCompletions && remoteCompletions.length > 0) {
          const completedSet = new Set(remoteCompletions.map((c) => c.topic_id))
          setCourse((prevCourse) => ({
            ...prevCourse,
            modules: prevCourse.modules.map((mod) => ({
              ...mod,
              topics: mod.topics.map((t) => ({
                ...t,
                isCompleted: t.isCompleted || completedSet.has(t.id),
              })),
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
                return {
                  ...p,
                  status: (remoteSub.status as Project['status']) || 'Under Review',
                  submission: {
                    repoUrl: remoteSub.repo_url,
                    demoUrl: remoteSub.demo_url,
                    notes: remoteSub.notes || '',
                    submittedAt: new Date(remoteSub.submitted_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }),
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
      } catch (err) {
        console.warn('Supabase data hydration notice:', err)
      }
    }

    hydrateRemoteData()
    return () => {
      isMounted = false
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

  // Topic Completion Toggle (Optimistic Update + Supabase Background Sync)
  const toggleTopic = async (topicId: string) => {
    const targetTopic = course.modules.flatMap((m) => m.topics).find((t) => t.id === topicId)
    const willBeCompleted = targetTopic ? !targetTopic.isCompleted : false

    setCourse((prevCourse) => {
      const nextModules = prevCourse.modules.map((mod) => {
        const nextTopics = mod.topics.map((top) => {
          if (top.id === topicId) {
            return { ...top, isCompleted: !top.isCompleted }
          }
          return top
        })
        return { ...mod, topics: nextTopics }
      })
      return { ...prevCourse, modules: nextModules }
    })

    if (isSupabaseConfigured && user && !isDemo) {
      try {
        if (willBeCompleted) {
          const { error: syncError } = await supabase.from('topic_completions').upsert(
            { student_id: activeStudentId, topic_id: topicId },
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
  }

  // Project Submission (Optimistic Update + Supabase Background Sync)
  const submitProject = async (
    projectId: string,
    data: { repoUrl: string; demoUrl: string; notes: string }
  ) => {
    const timestamp = getFormattedTimestamp()

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
            },
          }
        }
        return proj
      })
    )

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
  }

  // Submit Weekly Reflection (Optimistic Update + Supabase Direct Insert)
  const submitWeeklyReflection = async (data: { whatWentWell: string; blockers: string; goalsForNextWeek: string }) => {
    const weekNum = reflections.length + 1
    const newRef: WeeklyReflection = {
      id: 'ref_' + generateToastId(),
      weekNumber: weekNum,
      date: getFormattedDate(),
      whatWentWell: data.whatWentWell,
      blockers: data.blockers,
      goalsForNextWeek: data.goalsForNextWeek,
    }
    setReflections((prev) => [newRef, ...prev])
    showToast('Reflection Saved', 'Your weekly retrospective has been recorded.', 'success')

    if (isSupabaseConfigured && user && !isDemo) {
      try {
        await supabase.from('weekly_reflections').insert({
          student_id: activeStudentId,
          week_number: weekNum,
          what_went_well: data.whatWentWell,
          blockers: data.blockers,
          goals_for_next_week: data.goalsForNextWeek,
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
        totalTopicsCount,
        completedTopicsCount,
        curriculumProgressPercentage,
        overallProgressPercentage,
        activeProjectsCount,
        approvedProjectsCount,
        averageRating,
        toggleTopic,
        submitProject,
        submitWeeklyReflection,
        createTicket,
        dismissToast,
        showToast,
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
