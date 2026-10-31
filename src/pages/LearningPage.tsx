import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { Topic, Module } from '../types'
import { PageHeader } from '../components/ui/FeedbackStates'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/FormField'
import { getTopicResources } from '../data/learningResources'
import {
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  Code,
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  Play,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  GraduationCap,
  Loader2,
  Copy,
  Trophy,
  ChevronLeft,
} from 'lucide-react'

interface CourseMeta {
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  thumbnail: string
  accentColor: string
}

const COURSE_METADATA: Record<string, CourseMeta> = {
  mod_1: {
    category: 'Frontend Engineering',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    accentColor: '#7950F2',
  },
  mod_2: {
    category: 'Architecture & Routing',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    accentColor: '#3B82F6',
  },
  mod_3: {
    category: 'Backend & Database',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    accentColor: '#10B981',
  },
  mod_4: {
    category: 'Full-Stack Integration',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    accentColor: '#F59E0B',
  },
  mod_5: {
    category: 'DevOps & CI/CD',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80',
    accentColor: '#6366F1',
  },
}

function getCourseMeta(module: Module): CourseMeta {
  if (COURSE_METADATA[module.id]) {
    return COURSE_METADATA[module.id]
  }
  return {
    category: module.weekNumber <= 2 ? 'Frontend' : module.weekNumber <= 3 ? 'Backend' : 'DevOps',
    difficulty: module.weekNumber === 1 ? 'Beginner' : module.weekNumber <= 3 ? 'Intermediate' : 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    accentColor: '#7950F2',
  }
}

/**
 * Thumbnail component with strict 1:1 aspect ratio and graceful fallback
 */
const CourseThumbnail: React.FC<{
  src: string
  alt: string
  category: string
  accentColor: string
}> = ({ src, alt, category, accentColor }) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className="w-full aspect-square flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-slate-50 to-slate-100"
        style={{
          borderBottom: `3px solid ${accentColor}`,
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2.5 shadow-xs"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <BookOpen className="w-7 h-7" style={{ color: accentColor }} />
        </div>
        <span className="text-[12px] font-bold tracking-wider uppercase text-[#0F172A]">
          {category}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      loading="lazy"
      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
    />
  )
}

export const LearningPage: React.FC = () => {
  const {
    course,
    curriculumProgressPercentage,
    completedTopicsCount,
    totalTopicsCount,
    toggleTopic,
    startTopic,
    startedTopicIds,
  } = useApp()

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCourseId = searchParams.get('course')

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [lessonFilter, setLessonFilter] = useState<'all' | 'in-progress' | 'completed' | 'not-started'>('all')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [savingTopicId, setSavingTopicId] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  // Active selected course module if student opened a course
  const activeCourse = useMemo(() => {
    if (!selectedCourseId) return null
    return course.modules.find((m) => m.id === selectedCourseId) || null
  }, [course.modules, selectedCourseId])

  // Calculate overall curriculum metrics
  const totalMinutes = useMemo(() => {
    return course.modules.reduce(
      (sum, m) => sum + m.topics.reduce((tSum, t) => tSum + t.durationMinutes, 0),
      0
    )
  }, [course.modules])

  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  // Filter courses in the catalog
  const filteredCourses = useMemo(() => {
    return course.modules.filter((mod) => {
      const meta = getCourseMeta(mod)
      const matchesSearch =
        mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meta.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.topics.some(
          (t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
        )

      if (!matchesSearch) return false

      if (categoryFilter === 'all') return true
      if (categoryFilter === 'completed') {
        return mod.topics.length > 0 && mod.topics.every((t) => t.isCompleted)
      }
      if (categoryFilter === 'in-progress') {
        const completedCount = mod.topics.filter((t) => t.isCompleted).length
        return completedCount > 0 && completedCount < mod.topics.length
      }
      if (categoryFilter === 'frontend') {
        return meta.category.toLowerCase().includes('frontend') || meta.category.toLowerCase().includes('routing')
      }
      if (categoryFilter === 'backend') {
        return meta.category.toLowerCase().includes('backend') || meta.category.toLowerCase().includes('database')
      }
      if (categoryFilter === 'devops') {
        return meta.category.toLowerCase().includes('devops') || meta.category.toLowerCase().includes('ci/cd')
      }

      return true
    })
  }, [course.modules, searchQuery, categoryFilter])

  const handleSelectCourse = (courseId: string) => {
    setSearchParams({ course: courseId })
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch {
        // jsdom fallback
      }
    }
  }

  const handleBackToCourses = () => {
    setSearchParams({})
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch {
        // jsdom fallback
      }
    }
  }

  // Active course metrics if a course is selected
  const activeCourseMeta = activeCourse ? getCourseMeta(activeCourse) : null
  const activeCourseTotal = activeCourse ? activeCourse.topics.length : 0
  const activeCourseDone = activeCourse
    ? activeCourse.topics.filter((t) => t.isCompleted).length
    : 0
  const activeCoursePercent =
    activeCourseTotal > 0 ? Math.round((activeCourseDone / activeCourseTotal) * 100) : 0
  const activeCourseDuration = activeCourse
    ? activeCourse.topics.reduce((acc, t) => acc + t.durationMinutes, 0)
    : 0
  const activeCourseCodeCount = activeCourse
    ? activeCourse.topics.filter((t) => Boolean(t.codeSnippet)).length
    : 0

  // Identify the first incomplete topic as "Current / Next Up" lesson
  const currentLessonId = useMemo(() => {
    if (!activeCourse) return null
    const firstIncomplete = activeCourse.topics.find((t) => !t.isCompleted)
    return firstIncomplete ? firstIncomplete.id : null
  }, [activeCourse])

  // Next up topic for the Hero "Continue Learning" action
  const nextUpTopic = useMemo(() => {
    if (!activeCourse) return null
    return activeCourse.topics.find((t) => !t.isCompleted) || activeCourse.topics[0]
  }, [activeCourse])

  // Filter lessons within active course
  const filteredActiveTopics = useMemo(() => {
    if (!activeCourse) return []
    return activeCourse.topics.filter((topic) => {
      const isStarted = startedTopicIds.includes(topic.id)
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (lessonFilter === 'all') return true
      if (lessonFilter === 'completed') return topic.isCompleted
      if (lessonFilter === 'in-progress') return !topic.isCompleted && isStarted
      if (lessonFilter === 'not-started') return !topic.isCompleted && !isStarted

      return true
    })
  }, [activeCourse, searchQuery, lessonFilter, startedTopicIds])

  // Functional Checkbox Toggle with saving indicator and error handling
  const handleToggleTopic = async (topicId: string) => {
    if (savingTopicId) return
    setSavingTopicId(topicId)
    try {
      await toggleTopic(topicId)
      // If modal is open for this topic, update modal state
      setSelectedTopic((prev) =>
        prev && prev.id === topicId ? { ...prev, isCompleted: !prev.isCompleted } : prev
      )
    } finally {
      setSavingTopicId(null)
    }
  }

  // Functional Lesson Action: Start Lesson (transitions status to In Progress)
  const handleStartLesson = (topic: Topic) => {
    startTopic(topic.id)
    setSelectedTopic(topic)
  }

  // Functional Lesson Action: Continue Learning (opens saved progress)
  const handleContinueLesson = (topic: Topic) => {
    startTopic(topic.id)
    setSelectedTopic(topic)
  }

  // Functional Lesson Action: Review Lesson (revisits without resetting status)
  const handleReviewLesson = (topic: Topic) => {
    setSelectedTopic(topic)
  }

  // Navigation inside the Lesson Detail Modal
  const currentModalIndex = useMemo(() => {
    if (!selectedTopic || !activeCourse) return -1
    return activeCourse.topics.findIndex((t) => t.id === selectedTopic.id)
  }, [selectedTopic, activeCourse])

  const handlePrevLesson = () => {
    if (!activeCourse || currentModalIndex <= 0) return
    const prevTopic = activeCourse.topics[currentModalIndex - 1]
    if (prevTopic) {
      startTopic(prevTopic.id)
      setSelectedTopic(prevTopic)
    }
  }

  const handleNextLesson = () => {
    if (!activeCourse || currentModalIndex >= activeCourse.topics.length - 1) return
    const nextTopic = activeCourse.topics[currentModalIndex + 1]
    if (nextTopic) {
      startTopic(nextTopic.id)
      setSelectedTopic(nextTopic)
    }
  }

  const handleCopyCode = (snippet: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(snippet)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  // Resources for the active modal topic
  const activeResources = useMemo(() => {
    if (!selectedTopic) return []
    return getTopicResources(selectedTopic.id, selectedTopic.resourceLink)
  }, [selectedTopic])

  return (
    <div className="space-y-8">
      {/* =========================================================================
          VIEW A: INDIVIDUAL COURSE DETAIL VIEW (When student selects a course)
          Features modern lesson cards, verified resources, functional actions
         ========================================================================= */}
      {activeCourse && activeCourseMeta ? (
        <div className="space-y-6">
          {/* Top Breadcrumb & Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBackToCourses}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748B] hover:text-[#7950F2] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All Courses</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F3F0FF] text-[#7950F2]">
                {activeCourseMeta.category}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-[#0F172A]">
                {activeCourseMeta.difficulty}
              </span>
            </div>
          </div>

          {/* Selected Course Hero Card */}
          <Card padding="md" className="hero-gradient border-[#7950F2]/15">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-[6px] bg-[#7950F2] text-white text-[11px] font-bold">
                    Week {activeCourse.weekNumber}
                  </span>
                  <span className="text-[12px] font-semibold text-[#7950F2] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {activeCourseTotal} {activeCourseTotal === 1 ? 'Lesson' : 'Lessons'} • {activeCourseDuration} Mins
                  </span>
                  {activeCourseCodeCount > 0 && (
                    <span className="text-[12px] font-medium text-[#64748B] flex items-center gap-1">
                      <Code className="w-3.5 h-3.5 text-[#7950F2]" /> {activeCourseCodeCount} Code Exercises
                    </span>
                  )}
                </div>

                <h2 className="text-[22px] md:text-[24px] font-bold text-[#0F172A] leading-tight">
                  {activeCourse.title}
                </h2>

                <p className="text-[14px] text-[#64748B] leading-[22px]">
                  {activeCourse.description}
                </p>

                {/* Primary CTA in Hero Card */}
                <div className="pt-1 flex items-center gap-3">
                  {nextUpTopic && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleContinueLesson(nextUpTopic)}
                      className="shadow-sm"
                      icon={
                        activeCoursePercent === 100 ? (
                          <RotateCcw className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )
                      }
                    >
                      {activeCoursePercent === 100 ? 'Review Course Lessons' : 'Continue Learning'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Course Progress KPI Block */}
              <div className="flex items-center gap-4 shrink-0 bg-white p-4 sm:p-5 rounded-[12px] border border-[#E2E8F0] shadow-xs">
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider">
                    Course Progress
                  </span>
                  <span className="text-[14px] font-bold text-[#0F172A]">
                    {activeCourseDone} / {activeCourseTotal} Completed
                  </span>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-[#EEF1F7] flex items-center justify-center relative">
                  <span className="text-[15px] font-bold text-[#7950F2]">{activeCoursePercent}%</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <ProgressBar
                value={activeCoursePercent}
                variant={activeCoursePercent === 100 ? 'success' : 'primary'}
              />
            </div>
          </Card>

          {/* Celebratory Banner when Course is 100% Completed */}
          {activeCoursePercent === 100 && (
            <div className="p-4 rounded-[12px] bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[14px] font-bold text-[#087F5B]">
                  Course Completed! All Lessons & Exercises Finished
                </h4>
                <p className="text-[13px] text-[#25324B]/80 mt-0.5">
                  Great achievement! Your completion has been saved in Supabase and factored into your overall internship evaluation.
                </p>
              </div>
            </div>
          )}

          {/* Course Modules, Lessons & Syllabus Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-bold text-[#0F172A]">
                  Course Syllabus & Lesson Topics
                </h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Check off topics to record daily activity and update your learning streak.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge variant={activeCoursePercent === 100 ? 'success' : 'primary'}>
                  {activeCoursePercent === 100
                    ? 'Course Completed'
                    : `${activeCourseTotal - activeCourseDone} Lessons Remaining`}
                </StatusBadge>
              </div>
            </div>

            {/* In-Course Search & Status Filter Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-sm">
                <Input
                  icon={<Search className="w-3.5 h-3.5 text-[#64748B]" />}
                  placeholder="Filter lessons in this course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1 shrink-0">
                  <Filter className="w-3 h-3" /> Status:
                </span>
                {[
                  { id: 'all', label: 'All Lessons' },
                  { id: 'in-progress', label: 'In Progress' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'not-started', label: 'Not Started' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setLessonFilter(pill.id as typeof lessonFilter)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer select-none ${
                      lessonFilter === pill.id
                        ? 'bg-[#7950F2] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modern Lesson Cards List */}
            {filteredActiveTopics.length === 0 ? (
              <Card padding="lg" className="text-center py-10">
                <BookOpen className="w-8 h-8 text-[#64748B] mx-auto mb-2 opacity-50" />
                <p className="text-[14px] font-medium text-[#0F172A]">No lessons match your filter</p>
                <p className="text-[12px] text-[#64748B] mt-1">Try resetting your search query or status filter.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-[12px]"
                  onClick={() => {
                    setSearchQuery('')
                    setLessonFilter('all')
                  }}
                >
                  Reset Filter
                </Button>
              </Card>
            ) : (
              <div className="space-y-3.5">
                {filteredActiveTopics.map((topic, index) => {
                  const isStarted = startedTopicIds.includes(topic.id)
                  const isCompleted = topic.isCompleted
                  const isInProgress = !isCompleted && isStarted
                  const isCurrent = topic.id === currentLessonId
                  const isSaving = savingTopicId === topic.id
                  const resources = getTopicResources(topic.id, topic.resourceLink)

                  return (
                    <div
                      key={topic.id}
                      className={`p-4 sm:p-5 rounded-[12px] border transition-all duration-200 bg-white ${
                        isCurrent
                          ? 'border-[#7950F2] ring-2 ring-[#7950F2]/15 shadow-sm'
                          : isCompleted
                          ? 'border-[#E2E8F0] bg-slate-50/40 hover:border-[#CBD5E1]'
                          : 'border-[#E2E8F0] hover:border-[#7950F2]/30 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left: Checkbox + Lesson Info */}
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          {/* Functional Checkbox with Saving Indicator */}
                          <button
                            type="button"
                            onClick={() => handleToggleTopic(topic.id)}
                            disabled={isSaving}
                            className={`w-5 h-5 rounded-[6px] border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer focus-ring disabled:opacity-60 disabled:cursor-not-allowed ${
                              isCompleted
                                ? 'bg-[#20C997] border-[#20C997] text-white'
                                : 'border-[#CBD5E1] bg-white hover:border-[#7950F2]'
                            }`}
                            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {isSaving ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7950F2]" />
                            ) : isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : null}
                          </button>

                          <div className="min-w-0 flex-1">
                            {/* Badges Row */}
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="px-2 py-0.5 rounded-[4px] bg-slate-100 text-[#475569] text-[10px] font-bold uppercase tracking-wider">
                                Lesson {index + 1}
                              </span>

                              {/* Status Badges */}
                              {isCompleted ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6FCF5] text-[#087F5B] text-[11px] font-bold">
                                  <Check className="w-3 h-3" /> Completed
                                </span>
                              ) : isInProgress ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3F0FF] text-[#7950F2] text-[11px] font-bold">
                                  <Play className="w-2.5 h-2.5 fill-current" /> In Progress
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-[#64748B] text-[11px] font-medium">
                                  Not Started
                                </span>
                              )}

                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                                  <Sparkles className="w-2.5 h-2.5" /> Current Lesson
                                </span>
                              )}
                            </div>

                            {/* Lesson Title (NO strikethrough styling!) */}
                            <h4 className="text-[15px] font-bold text-[#0F172A] leading-snug">
                              {topic.title}
                            </h4>

                            {/* Short Description */}
                            <p className="text-[13px] text-[#64748B] mt-1 leading-[20px] line-clamp-2">
                              {topic.description}
                            </p>

                            {/* Lesson Metadata Row */}
                            <div className="flex items-center gap-3 mt-2 text-[12px] text-[#64748B] flex-wrap">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {topic.durationMinutes} minutes
                              </span>

                              {topic.codeSnippet && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="flex items-center gap-1 text-[#7950F2] font-medium">
                                    <Code className="w-3.5 h-3.5" /> Code Sample
                                  </span>
                                </>
                              )}

                              {resources.length > 0 && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="flex items-center gap-1 text-[#0F172A] font-medium">
                                    <ExternalLink className="w-3.5 h-3.5 text-[#3B82F6]" />
                                    {resources.length} {resources.length === 1 ? 'Resource' : 'Resources'}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Functional Lesson Action Button */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {isCompleted ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleReviewLesson(topic)}
                              className="text-[12px] font-semibold"
                              icon={<RotateCcw className="w-3.5 h-3.5" />}
                            >
                              Review Lesson
                            </Button>
                          ) : isInProgress ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleContinueLesson(topic)}
                              className="text-[12px] font-semibold shadow-xs"
                              icon={<Play className="w-3.5 h-3.5 fill-current" />}
                            >
                              Continue Learning
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartLesson(topic)}
                              className="text-[12px] font-semibold"
                              icon={<BookOpen className="w-3.5 h-3.5" />}
                            >
                              Start Lesson
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW B: CONSOLIDATED COURSE CATALOG VIEW (Displaying all courses)
            Features modern square-style course cards inspired by Coursera & Udemy
           ========================================================================= */
        <div className="space-y-8">
          {/* Page Header */}
          <PageHeader
            title="Learning Curriculum & Courses"
            subtitle="Explore industry-standard course tracks, interactive lesson modules, and technical documentation."
            badge={
              <StatusBadge variant="primary">
                {completedTopicsCount} / {totalTopicsCount} Topics Done
              </StatusBadge>
            }
          />

          {/* Track Overview Banner */}
          <Card padding="md" className="hero-gradient border-[#7950F2]/15">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7950F2]/10 text-[#7950F2] flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" /> Full-Stack Engineering Fellowship
                  </span>
                </div>
                <h3 className="text-[18px] font-bold text-[#0F172A]">Overall Curriculum Completion</h3>
                <p className="text-[13px] text-[#64748B] leading-[20px]">
                  Complete technical lessons and hands-on exercises to build production competence. Topic completions dynamically recalculate your sprint milestones and progress metrics.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="px-3.5 py-2.5 rounded-[10px] bg-white border border-[#E2E8F0] shadow-xs text-center min-w-[85px]">
                  <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider">
                    Courses
                  </span>
                  <span className="text-[18px] font-bold text-[#0F172A]">{course.modules.length}</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-[10px] bg-white border border-[#E2E8F0] shadow-xs text-center min-w-[85px]">
                  <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider">
                    Lessons
                  </span>
                  <span className="text-[18px] font-bold text-[#0F172A]">
                    {completedTopicsCount}/{totalTopicsCount}
                  </span>
                </div>
                <div className="px-3.5 py-2.5 rounded-[10px] bg-white border border-[#E2E8F0] shadow-xs text-center min-w-[85px]">
                  <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider">
                    Est. Time
                  </span>
                  <span className="text-[18px] font-bold text-[#0F172A]">{totalHours}h</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-[10px] bg-white border border-[#E2E8F0] shadow-xs text-center min-w-[85px]">
                  <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider">
                    Progress
                  </span>
                  <span className="text-[18px] font-bold text-[#7950F2]">
                    {curriculumProgressPercentage}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <ProgressBar value={curriculumProgressPercentage} variant="primary" />
            </div>
          </Card>

          {/* Course Catalog Header & Search Toolbar */}
          <div className="space-y-4">
            <div>
              <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
                Course Catalog
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Select a course to view its complete curriculum, modules, lessons, and interactive exercises.
              </p>
            </div>

            {/* Search & Category Filter Pills */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-md">
                <Input
                  icon={<Search className="w-4 h-4 text-[#64748B]" />}
                  placeholder="Search courses, lessons, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <span className="text-[12px] font-medium text-[#64748B] flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {[
                  { id: 'all', label: 'All Courses' },
                  { id: 'in-progress', label: 'In Progress' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'frontend', label: 'Frontend' },
                  { id: 'backend', label: 'Backend' },
                  { id: 'devops', label: 'DevOps' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors cursor-pointer select-none ${
                      categoryFilter === tab.id
                        ? 'bg-[#7950F2] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Square Course Cards Responsive Grid */}
          {filteredCourses.length === 0 ? (
            <Card padding="lg" className="text-center py-12">
              <BookOpen className="w-10 h-10 text-[#64748B] mx-auto mb-3 opacity-60" />
              <h4 className="text-[16px] font-semibold text-[#0F172A]">No courses match your filter</h4>
              <p className="text-[13px] text-[#64748B] mt-1">
                Try searching for different keywords or reset your category filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('all')
                }}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((module) => {
                const meta = getCourseMeta(module)
                const totalLessons = module.topics.length
                const completedLessons = module.topics.filter((t) => t.isCompleted).length
                const progressPct =
                  totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
                const isCompleted = progressPct === 100
                const isInProgress = progressPct > 0 && !isCompleted
                const durationMins = module.topics.reduce((acc, t) => acc + t.durationMinutes, 0)

                return (
                  <div
                    key={module.id}
                    onClick={() => handleSelectCourse(module.id)}
                    className="group bg-white rounded-[14px] border border-[#E2E8F0] hover:border-[#7950F2]/40 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden text-left shadow-xs cursor-pointer"
                  >
                    {/* Square Thumbnail Container (1:1 Aspect Ratio) */}
                    <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
                      <CourseThumbnail
                        src={meta.thumbnail}
                        alt={module.title}
                        category={meta.category}
                        accentColor={meta.accentColor}
                      />

                      {/* Subtle Dark Gradient for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                      {/* Top Badges: Category & Difficulty */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#0F172A] shadow-xs backdrop-blur-xs">
                          {meta.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#0F172A]/80 text-white backdrop-blur-xs">
                          {meta.difficulty}
                        </span>
                      </div>

                      {/* Bottom Info on Thumbnail */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[12px] pointer-events-none">
                        <span className="font-semibold flex items-center gap-1 drop-shadow-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Week {module.weekNumber}
                        </span>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-xs">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7950F2] text-white text-[11px] font-bold shadow-xs">
                            <Play className="w-2.5 h-2.5 fill-current" /> In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[11px] font-medium backdrop-blur-xs">
                            Not Started
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Card Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Course Name */}
                        <h3 className="text-[15px] font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#7950F2] transition-colors">
                          {module.title}
                        </h3>

                        {/* Short Description (2–3 lines) */}
                        <p className="text-[13px] text-[#64748B] line-clamp-2 mt-1.5 leading-[19px] min-h-[38px]">
                          {module.description}
                        </p>

                        {/* Lessons & Duration Row */}
                        <div className="flex items-center gap-3 mt-3 text-[12px] text-[#64748B] pt-2.5 border-t border-[#F1F5F9]">
                          <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                            <BookOpen className="w-3.5 h-3.5 text-[#7950F2]" />
                            {totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {durationMins} mins
                          </span>
                        </div>
                      </div>

                      {/* Progress Indicator & Action Button */}
                      <div className="mt-4 pt-3 border-t border-[#F1F5F9] space-y-3">
                        {/* Student Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                            <span className="text-[#64748B]">
                              {completedLessons}/{totalLessons} Done
                            </span>
                            <span className={isCompleted ? 'text-emerald-600' : 'text-[#7950F2]'}>
                              {progressPct}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#EEF1F7] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isCompleted ? 'bg-emerald-500' : 'bg-[#7950F2]'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Action CTA */}
                        <Button
                          variant={isInProgress ? 'primary' : 'outline'}
                          size="sm"
                          className="w-full text-[13px]"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectCourse(module.id)
                          }}
                        >
                          {isCompleted ? (
                            <>
                              Review Course <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </>
                          ) : isInProgress ? (
                            <>
                              Continue Learning <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </>
                          ) : (
                            <>
                              View Course <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          LESSON DETAIL MODAL (With Navigation, Educational Content, & Real Resources)
         ========================================================================= */}
      {selectedTopic && (
        <Modal
          isOpen={Boolean(selectedTopic)}
          onClose={() => setSelectedTopic(null)}
          title={selectedTopic.title}
          description={`Week ${activeCourse?.weekNumber || 1} • Estimated Time: ${
            selectedTopic.durationMinutes
          } mins • ${selectedTopic.isCompleted ? 'Status: Completed' : 'Status: In Progress'}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Modal Sub-Header Status Bar */}
            <div className="p-3.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#0F172A]">
                  Lesson {currentModalIndex >= 0 ? currentModalIndex + 1 : 1} of {activeCourseTotal}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[12px] text-[#64748B] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedTopic.durationMinutes} mins
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedTopic.isCompleted ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6FCF5] text-[#087F5B] text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F3F0FF] text-[#7950F2] text-[11px] font-bold">
                    <Play className="w-2.5 h-2.5 fill-current" /> In Progress
                  </span>
                )}
              </div>
            </div>

            {/* 1. Lesson Overview & Concept */}
            <div>
              <h4 className="text-[14px] font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#7950F2]" /> Lesson Overview
              </h4>
              <p className="text-[14px] text-[#64748B] leading-[22px]">
                {selectedTopic.description}
              </p>
            </div>

            {/* 2. Key Learning Objectives */}
            <div>
              <h4 className="text-[14px] font-bold text-[#0F172A] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#20C997]" /> Key Learning Objectives
              </h4>
              <ul className="space-y-2">
                {selectedTopic.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-[13px] text-[#64748B] leading-[20px]">
                    <span className="w-5 h-5 rounded-full bg-[#E6FCF5] text-[#087F5B] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      {index + 1}
                    </span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Code Snippet if present */}
            {selectedTopic.codeSnippet && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-[#7950F2]" /> Technical Implementation & Exercise
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedTopic.codeSnippet || '')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#7950F2] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-[10px] bg-[#0F172A] text-slate-100 font-mono text-[12px] leading-[19px] overflow-x-auto shadow-inner border border-slate-800">
                  <pre>{selectedTopic.codeSnippet}</pre>
                </div>
              </div>
            )}

            {/* 4. Verified Learning Resources & References */}
            <div>
              <h4 className="text-[14px] font-bold text-[#0F172A] mb-2.5 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-[#3B82F6]" /> Technical Documentation & Resources
              </h4>
              {activeResources.length === 0 ? (
                <div className="p-3.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-[13px] text-[#64748B]">
                  No external links attached to this lesson topic.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeResources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-[8px] border border-[#E2E8F0] hover:border-[#7950F2] bg-white hover:bg-[#F8FAFF] transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#7950F2] mb-1">
                          <span className="uppercase tracking-wider">{res.platform}</span>
                          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                        <h5 className="text-[13px] font-semibold text-[#0F172A] group-hover:text-[#7950F2] transition-colors leading-[18px]">
                          {res.title}
                        </h5>
                      </div>
                      {res.description && (
                        <p className="text-[11px] text-[#64748B] mt-1.5 line-clamp-2">
                          {res.description}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Navigation & Footer Completion Toggle */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Previous / Next Lesson Navigation Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevLesson}
                  disabled={currentModalIndex <= 0}
                  className="text-[12px]"
                  icon={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextLesson}
                  disabled={!activeCourse || currentModalIndex >= activeCourse.topics.length - 1}
                  className="text-[12px]"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>

              {/* Functional Mark as Completed / Incomplete Action */}
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedTopic.isCompleted ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={savingTopicId === selectedTopic.id}
                  onClick={() => handleToggleTopic(selectedTopic.id)}
                  icon={
                    savingTopicId === selectedTopic.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )
                  }
                >
                  {savingTopicId === selectedTopic.id
                    ? 'Saving to Supabase...'
                    : selectedTopic.isCompleted
                    ? 'Mark as Incomplete'
                    : 'Mark as Completed'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
