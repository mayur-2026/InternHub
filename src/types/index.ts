export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl: string
  bio: string
  university: string
  graduationYear: string
  githubUrl: string
  linkedinUrl: string
  role: 'Student Intern' | 'Mentor'
  track: string
  joinedDate: string
}

export interface InternshipInfo {
  id: string
  title: string
  company: string
  role: string
  cohort: string
  startDate: string
  endDate: string
  status: 'Active' | 'Completed' | 'Evaluation'
  stipend: string
  hoursPerWeek: number
  description: string
  mentor: {
    name: string
    title: string
    email: string
    avatar: string
    officeHours: string
    meetingLink: string
  }
}

export interface Topic {
  id: string
  moduleId: string
  title: string
  durationMinutes: number
  isCompleted: boolean
  description: string
  keyTakeaways: string[]
  codeSnippet?: string
  resourceLink?: string
}

export interface Module {
  id: string
  title: string
  description: string
  weekNumber: number
  topics: Topic[]
}

export interface Course {
  id: string
  title: string
  totalModules: number
  modules: Module[]
}

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Under Review' | 'Approved' | 'Changes Requested'
export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface ProjectSubmission {
  repoUrl: string
  demoUrl: string
  notes: string
  submittedAt: string
  grade?: number
  mentorFeedback?: string
}

export interface Project {
  id: string
  title: string
  description: string
  difficulty: ProjectDifficulty
  status: ProjectStatus
  dueDate: string
  estimatedHours: number
  techStack: string[]
  deliverables: string[]
  submission?: ProjectSubmission
}

export interface FeedbackEvaluation {
  id: string
  mentorName: string
  mentorRole: string
  mentorAvatar: string
  date: string
  overallRating: number
  criteria: {
    codeQuality: number
    architecture: number
    uiux: number
    communication: number
  }
  comments: string
  projectName?: string
}

export interface WeeklyReflection {
  id: string
  weekNumber: number
  date: string
  whatWentWell: string
  blockers: string
  goalsForNextWeek: string
}

export type TicketCategory = 'Technical Issue' | 'Curriculum Doubt' | 'Deadline Extension' | 'General Inquiry'
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved'

export interface SupportTicket {
  id: string
  ticketNumber: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  description: string
  lastReply?: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

