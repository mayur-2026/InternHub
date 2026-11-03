import React from 'react'
import type { InternshipInfo, Course, Project } from '../../types'
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  FolderGit2,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  User,
  BookOpen,
} from 'lucide-react'

export interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: 'Sections' | 'Projects' | 'Topics'
  keywords?: string[]
  to: string
  icon: React.ReactNode
}

export function buildSearchIndex(
  internship: InternshipInfo,
  projects: Project[],
  course: Course
): SearchItem[] {
  return [
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
    ...projects.map((proj) => ({
      id: `proj-${proj.id}`,
      title: proj.title,
      subtitle: `${proj.difficulty} • Due ${proj.dueDate} • Status: ${proj.status}`,
      category: 'Projects' as const,
      keywords: ['project', proj.difficulty.toLowerCase(), proj.status.toLowerCase(), 'submission'],
      to: '/projects',
      icon: <FolderGit2 className="w-4 h-4 text-[#F06595]" />,
    })),
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
}
