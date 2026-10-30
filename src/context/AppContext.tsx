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
  INITIAL_COURSE,
  INITIAL_PROJECTS,
  INITIAL_FEEDBACK,
  INITIAL_REFLECTIONS,
  INITIAL_TICKETS,
  INITIAL_FAQS,
} from '../data/seedData'

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
  toggleTopic: (topicId: string) => void
  submitProject: (projectId: string, data: { repoUrl: string; demoUrl: string; notes: string }) => void
  submitWeeklyReflection: (data: { whatWentWell: string; blockers: string; goalsForNextWeek: string }) => void
  createTicket: (data: { subject: string; category: TicketCategory; priority: TicketPriority; description: string }) => void
  dismissToast: (id: string) => void
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const COURSE_STORAGE_KEY = 'internhub_course_data'
const PROJECTS_STORAGE_KEY = 'internhub_projects_data'
const REFLECTIONS_STORAGE_KEY = 'internhub_reflections_data'
const TICKETS_STORAGE_KEY = 'internhub_tickets_data'

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [internship] = useState<InternshipInfo>(INITIAL_INTERNSHIP)

  const [course, setCourse] = useState<Course>(() => {
    const saved = localStorage.getItem(COURSE_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return INITIAL_COURSE
      }
    }
    return INITIAL_COURSE
  })

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return INITIAL_PROJECTS
      }
    }
    return INITIAL_PROJECTS
  })

  const [feedbackList] = useState<FeedbackEvaluation[]>(INITIAL_FEEDBACK)

  const [reflections, setReflections] = useState<WeeklyReflection[]>(() => {
    const saved = localStorage.getItem(REFLECTIONS_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return INITIAL_REFLECTIONS
      }
    }
    return INITIAL_REFLECTIONS
  })

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(TICKETS_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return INITIAL_TICKETS
      }
    }
    return INITIAL_TICKETS
  })

  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(course))
  }, [course])

  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(reflections))
  }, [reflections])

  useEffect(() => {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))
  }, [tickets])

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

  const averageRating = 4.9

  // Topic Completion Toggle (Instant Optimistic Update)
  const toggleTopic = (topicId: string) => {
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

    if (willBeCompleted) {
      showToast('Topic Completed', 'Your curriculum progress has been updated!', 'success')
    }
  }

  // Project Submission
  const submitProject = (
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

    showToast('Project Submitted', 'Your deliverables are now under mentor review.', 'success')
  }

  // Submit Weekly Reflection
  const submitWeeklyReflection = (data: { whatWentWell: string; blockers: string; goalsForNextWeek: string }) => {
    const newRef: WeeklyReflection = {
      id: 'ref_' + generateToastId(),
      weekNumber: reflections.length + 1,
      date: getFormattedDate(),
      whatWentWell: data.whatWentWell,
      blockers: data.blockers,
      goalsForNextWeek: data.goalsForNextWeek,
    }
    setReflections((prev) => [newRef, ...prev])
    showToast('Reflection Saved', 'Your weekly retrospective has been recorded.', 'success')
  }

  // Create Support Ticket
  const createTicket = (data: { subject: string; category: TicketCategory; priority: TicketPriority; description: string }) => {
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

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
