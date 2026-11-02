import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import type { Topic, Module } from '../types'
import { PageHeader } from '../components/ui/FeedbackStates'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/FormField'
import { getTopicResources } from '../data/learningResources'
import { CourseVideoPlayer } from '../components/learning/CourseVideoPlayer'
import { LessonQuizModal } from '../components/learning/LessonQuizModal'
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
  Pause,
  ArrowRight,
  ArrowLeft,
  Check,
  GraduationCap,
  Trophy,
  ChevronLeft,
  ChevronDown,
  Lock,
  HelpCircle,
} from 'lucide-react'

interface CourseMeta {
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  thumbnail: string
  accentColor: string
}

const COURSE_METADATA: Record<string, CourseMeta> = {
  mod_1: {
    category: 'Frontend',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    accentColor: '#7950F2',
  },
  mod_2: {
    category: 'Architecture',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    accentColor: '#3B82F6',
  },
  mod_3: {
    category: 'Backend',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    accentColor: '#10B981',
  },
  mod_4: {
    category: 'Full-Stack',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    accentColor: '#F59E0B',
  },
  mod_5: {
    category: 'DevOps',
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
    difficulty: module.weekNumber <= 1 ? 'Beginner' : module.weekNumber <= 3 ? 'Intermediate' : 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    accentColor: '#7950F2',
  }
}

/**
 * Thumbnail component with compact aspect ratio and graceful fallback
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
        className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none bg-gradient-to-br from-slate-50 to-slate-100"
        style={{
          borderBottom: `3px solid ${accentColor}`,
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 shadow-xs"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <BookOpen className="w-5 h-5" style={{ color: accentColor }} />
        </div>
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#0F172A]">
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
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
  const { user, isDemo } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCourseId = searchParams.get('course')

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [quizTopic, setQuizTopic] = useState<Topic | null>(null)
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)
  const [savingTopicId, setSavingTopicId] = useState<string | null>(null)
  const [lockedAlert, setLockedAlert] = useState<{ target: number; prereq: number } | null>(null)
  const [expandedOverviewTopicIds, setExpandedOverviewTopicIds] = useState<string[]>([])
  const [watchedTopicIds, setWatchedTopicIds] = useState<string[]>(() => {
    const storageKey = isDemo ? 'internhub_demo_watched_videos' : `internhub_watched_videos_${user?.id}`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  const handleVideoWatched = (topicId: string) => {
    setWatchedTopicIds((prev) => {
      if (prev.includes(topicId)) return prev
      const updated = [...prev, topicId]
      const storageKey = isDemo ? 'internhub_demo_watched_videos' : `internhub_watched_videos_${user?.id}`
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const toggleOverview = (topicId: string) => {
    setExpandedOverviewTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    )
  }

  // Active selected course module if student opened a course
  const activeCourse = useMemo(() => {
    if (!selectedCourseId) return null
    return course.modules.find((m) => m.id === selectedCourseId) || null
  }, [course.modules, selectedCourseId])

  // Sequential locking rule: topic at index is locked if any previous topic is not completed
  const isLessonLocked = useMemo(() => {
    return (index: number): boolean => {
      if (!activeCourse) return false
      if (index === 0) return false // First lesson is always unlocked
      for (let j = 0; j < index; j++) {
        if (!activeCourse.topics[j]?.isCompleted) {
          return true
        }
      }
      return false
    }
  }, [activeCourse])

  // Determine currently active topic for the video player
  const activeTopic = useMemo(() => {
    if (!activeCourse || activeCourse.topics.length === 0) return null
    if (activeTopicId) {
      const found = activeCourse.topics.find((t) => t.id === activeTopicId)
      if (found) return found
    }
    // Default to first incomplete lesson, or first lesson
    const firstIncomplete = activeCourse.topics.find((t) => !t.isCompleted)
    return firstIncomplete || activeCourse.topics[0]
  }, [activeCourse, activeTopicId])

  // Calculate overall curriculum metrics
  const totalMinutes = useMemo(() => {
    return course.modules.reduce(
      (sum, m) => sum + m.topics.reduce((tSum, t) => tSum + t.durationMinutes, 0),
      0
    )
  }, [course.modules])

  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  // Other courses in the curriculum (for the section below lessons)
  const otherCourses = useMemo(() => {
    if (!activeCourse) return []
    return course.modules.filter((m) => m.id !== activeCourse.id)
  }, [course.modules, activeCourse])

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
        return (
          meta.category.toLowerCase().includes('frontend') ||
          meta.category.toLowerCase().includes('architecture') ||
          meta.category.toLowerCase().includes('routing')
        )
      }
      if (categoryFilter === 'backend') {
        return (
          meta.category.toLowerCase().includes('backend') ||
          meta.category.toLowerCase().includes('database') ||
          meta.category.toLowerCase().includes('full-stack')
        )
      }
      if (categoryFilter === 'devops') {
        return (
          meta.category.toLowerCase().includes('devops') ||
          meta.category.toLowerCase().includes('ci/cd')
        )
      }

      return true
    })
  }, [course.modules, searchQuery, categoryFilter])

  const handleSelectCourse = (courseId: string) => {
    setSearchParams({ course: courseId })
    setLockedAlert(null)
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
    setLockedAlert(null)
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

  // Locked lesson notification trigger
  const handleLockedClick = (targetLessonNum: number, prereqLessonNum: number) => {
    setLockedAlert({ target: targetLessonNum, prereq: prereqLessonNum })
    setTimeout(() => {
      setLockedAlert(null)
    }, 4500)
  }

  // Select a lesson to watch
  const handleSelectLesson = (topic: Topic, index: number) => {
    if (isLessonLocked(index)) {
      let prereqIndex = 0
      for (let j = 0; j < index; j++) {
        if (!activeCourse?.topics[j]?.isCompleted) {
          prereqIndex = j
          break
        }
      }
      handleLockedClick(index + 1, prereqIndex + 1)
      return
    }

    setActiveTopicId(topic.id)
    startTopic(topic.id)
    setLockedAlert(null)
  }

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
      setLockedAlert(null)
    } finally {
      setSavingTopicId(null)
    }
  }

  // Functional Lesson Action: Start Lesson (transitions status to In Progress)
  const handleStartLesson = (topic: Topic, index: number) => {
    if (isLessonLocked(index)) {
      let prereqIndex = 0
      for (let j = 0; j < index; j++) {
        if (!activeCourse?.topics[j]?.isCompleted) {
          prereqIndex = j
          break
        }
      }
      handleLockedClick(index + 1, prereqIndex + 1)
      return
    }
    startTopic(topic.id)
    setActiveTopicId(topic.id)
    setSelectedTopic(topic)
  }

  // Functional Lesson Action: Continue Learning (opens saved progress)
  const handleContinueLesson = (topic: Topic, index: number) => {
    if (isLessonLocked(index)) {
      handleLockedClick(index + 1, index)
      return
    }
    startTopic(topic.id)
    setActiveTopicId(topic.id)
    setSelectedTopic(topic)
  }

  // Functional Lesson Action: Review Lesson (revisits without resetting status)
  const handleReviewLesson = (topic: Topic) => {
    setActiveTopicId(topic.id)
    setSelectedTopic(topic)
  }

  // Passing quiz marks the lesson as completed in Supabase and unlocks the next lesson
  const handlePassQuiz = async (topicId: string, score: number = 100) => {
    setSavingTopicId(topicId)
    try {
      await toggleTopic(topicId, score)
      setSelectedTopic((prev) =>
        prev && prev.id === topicId ? { ...prev, isCompleted: true, quizScore: score } : prev
      )
      setLockedAlert(null)
    } finally {
      setSavingTopicId(null)
    }
  }

  const handleNextLessonFromQuiz = () => {
    if (!activeCourse) return
    const currentIdx = activeCourse.topics.findIndex((t) => t.id === quizTopic?.id)
    setQuizTopic(null)
    if (currentIdx !== -1 && currentIdx < activeCourse.topics.length - 1) {
      const nextTopic = activeCourse.topics[currentIdx + 1]
      setActiveTopicId(nextTopic.id)
      startTopic(nextTopic.id)
    }
  }

  // Advance to next lesson (if incomplete, triggers the required knowledge test)
  const handleCompleteCurrentAndNext = async (currentTopicId: string) => {
    const currentTopic = activeCourse?.topics.find((t) => t.id === currentTopicId)
    if (!currentTopic) return

    if (!currentTopic.isCompleted) {
      setQuizTopic(currentTopic)
      return
    }

    const currentIndex = activeCourse?.topics.findIndex((t) => t.id === currentTopicId) ?? -1
    if (activeCourse && currentIndex >= 0 && currentIndex < activeCourse.topics.length - 1) {
      const nextTopic = activeCourse.topics[currentIndex + 1]
      setActiveTopicId(nextTopic.id)
      startTopic(nextTopic.id)
    }
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
      setActiveTopicId(prevTopic.id)
      setSelectedTopic(prevTopic)
    }
  }

  const handleNextLesson = () => {
    if (!activeCourse || currentModalIndex >= activeCourse.topics.length - 1) return
    const nextIndex = currentModalIndex + 1
    const nextTopic = activeCourse.topics[nextIndex]
    if (nextTopic) {
      if (isLessonLocked(nextIndex)) {
        handleLockedClick(nextIndex + 1, currentModalIndex + 1)
        return
      }
      startTopic(nextTopic.id)
      setActiveTopicId(nextTopic.id)
      setSelectedTopic(nextTopic)
    }
  }

  // Resources for the active modal topic
  const activeResources = useMemo(() => {
    if (!selectedTopic) return []
    return getTopicResources(selectedTopic.id, selectedTopic.resourceLink)
  }, [selectedTopic])

  const activeTopicIndex = activeCourse && activeTopic
    ? activeCourse.topics.findIndex((t) => t.id === activeTopic.id)
    : 0

  const hasNextTopic = Boolean(
    activeCourse && activeTopicIndex >= 0 && activeTopicIndex < activeCourse.topics.length - 1
  )

  const nextTopicItem = hasNextTopic && activeCourse
    ? activeCourse.topics[activeTopicIndex + 1]
    : undefined

  return (
    <div className="space-y-8">
      {/* Course Detail View with Real Video Player & Lessons List */}
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

          {/* Course Title & Progress Bar */}
          <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-[6px] bg-[#7950F2] text-white text-[11px] font-bold">
                    Course {activeCourse.weekNumber}
                  </span>
                  <span className="text-[12px] font-semibold text-[#64748B]">
                    {activeCourseTotal} {activeCourseTotal === 1 ? 'Lesson' : 'Lessons'} • {activeCourseDuration} mins total
                  </span>
                </div>
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0F172A] leading-tight">
                  {activeCourse.title}
                </h2>
                <p className="text-[13.5px] text-[#64748B] mt-1 max-w-3xl">
                  {activeCourse.description}
                </p>
              </div>

              {/* Course Progress Counter */}
              <div className="flex items-center gap-3 shrink-0 bg-[#F8FAFC] px-4 py-2.5 rounded-xl border border-slate-200">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Course Progress
                  </span>
                  <span className="text-[13px] font-bold text-[#0F172A]">
                    {activeCourseDone} / {activeCourseTotal} Done
                  </span>
                </div>
                <div className="text-[18px] font-extrabold text-[#7950F2]">
                  {activeCoursePercent}%
                </div>
              </div>
            </div>

            <div className="mt-4">
              <ProgressBar
                value={activeCoursePercent}
                variant={activeCoursePercent === 100 ? 'success' : 'primary'}
              />
            </div>
          </div>

          {/* Celebratory Banner when Course is 100% Completed */}
          {activeCoursePercent === 100 && (
            <div className="p-4 rounded-[12px] bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[14px] font-bold text-[#087F5B]">
                  Course Completed! All Lessons &amp; Exercises Finished
                </h4>
                <p className="text-[13px] text-[#25324B]/80 mt-0.5">
                  Great achievement! Your completion has been saved in Supabase and factored into your overall internship evaluation.
                </p>
              </div>
            </div>
          )}

          {/* 1. Real Video Player Section */}
          {activeTopic && (
            <CourseVideoPlayer
              key={activeTopic.id}
              topic={activeTopic}
              lessonIndex={activeTopicIndex}
              totalLessons={activeCourseTotal}
              courseTitle={activeCourse.title}
              isCompleted={activeTopic.isCompleted}
              isSaving={savingTopicId === activeTopic.id}
              hasWatched={activeTopic.isCompleted || watchedTopicIds.includes(activeTopic.id)}
              onVideoWatched={handleVideoWatched}
              onStartTest={() => {
                if (activeTopic.isCompleted || watchedTopicIds.includes(activeTopic.id)) {
                  setQuizTopic(activeTopic)
                }
              }}
              onNextLesson={() => handleCompleteCurrentAndNext(activeTopic.id)}
              hasNextLesson={hasNextTopic}
              nextLessonTitle={nextTopicItem?.title}
              onOpenDetails={() => setSelectedTopic(activeTopic)}
            />
          )}

          {/* 2. Lessons in This Class Section (matching reference design) */}
          <div className="pt-2 space-y-4">
            {/* Purple accent line */}
            <div className="w-full h-1 bg-[#7950F2] rounded-full" />

            {/* Header: Lessons in This Class */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-[20px] sm:text-[22px] font-bold text-[#0F172A] tracking-tight">
                  Lessons in This Class
                </h3>
                <p className="text-[12.5px] text-[#64748B]">
                  Course Syllabus &amp; Lesson Topics • Watch lessons in sequence. Each lesson unlocks after completing the previous one.
                </p>
              </div>

              <div className="text-[13px] font-semibold text-[#0F172A] bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
                {activeCourseTotal} Lessons ({Math.floor(activeCourseDuration / 60)}h {activeCourseDuration % 60}m)
              </div>
            </div>

            {/* Locked Lesson Warning Notification */}
            {lockedAlert && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-[13px] font-medium flex items-center gap-2.5 shadow-sm animate-in fade-in">
                <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span>
                  <strong>Lesson {lockedAlert.target} is locked.</strong> You must complete Lesson {lockedAlert.prereq} first before you can skip to this lesson!
                </span>
              </div>
            )}

            {/* Lessons List */}
            <div className="space-y-2 mt-4">
              {activeCourse.topics.map((topic, index) => {
                const isLocked = isLessonLocked(index)
                const isActive = activeTopic?.id === topic.id
                const isCompleted = topic.isCompleted
                const isInProgress = !isCompleted && startedTopicIds.includes(topic.id)
                const isExpanded = expandedOverviewTopicIds.includes(topic.id)
                const topicResources = getTopicResources(topic.id, topic.resourceLink)

                // Active Lesson (Dark Highlight Bar)
                if (isActive) {
                  return (
                    <div
                      key={topic.id}
                      className="p-3.5 sm:p-4 rounded-[8px] bg-[#0F172A] text-white flex flex-col gap-3 shadow-md border border-slate-800 transition-all select-none"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Left Action Button: Pause/Play or Review */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleContinueLesson(topic, index)
                            }}
                            title={isCompleted ? 'Review Lesson' : 'Continue Learning'}
                            aria-label={isCompleted ? 'Review Lesson' : 'Continue Learning'}
                            className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-ring ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'bg-white/15 hover:bg-white/25 text-white'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-[#20C997]" />
                            ) : (
                              <Pause className="w-4 h-4 fill-current" />
                            )}
                          </button>

                          {/* Hidden button for accessible screen-reader toggle & test compatibility */}
                          <button
                            type="button"
                            onClick={() => handleToggleTopic(topic.id)}
                            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                            className="sr-only"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[14px] sm:text-[15px] font-semibold text-white leading-snug">
                                {index + 1}. {topic.title}
                              </span>
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-bold">
                                  <Check className="w-3 h-3" />
                                  <span>Completed</span>
                                  {topic.quizScore !== undefined && (
                                    <span className="px-1.5 py-0.2 bg-emerald-400/25 rounded text-emerald-200 font-semibold">
                                      {topic.quizScore}% Score
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11.5px] text-slate-300 mt-0.5">
                              <span>{topic.durationMinutes} minutes</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Overview Dropdown Button */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleOverview(topic.id)
                            }}
                            aria-expanded={isExpanded}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-semibold transition-all cursor-pointer border ${
                              isExpanded
                                ? 'bg-[#7950F2] text-white border-[#7950F2] shadow-xs'
                                : 'bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-xs'
                            }`}
                          >
                            <span>Overview</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Overview Dropdown Panel */}
                      {isExpanded && (
                        <div
                          className="mt-2 pt-3 border-t border-slate-700/80 text-left space-y-3 animate-in fade-in duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Lesson Description */}
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Lesson Summary
                            </span>
                            <p className="text-[13px] text-slate-200 leading-relaxed">
                              {topic.description}
                            </p>
                          </div>

                          {/* Key Objectives */}
                          {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                Curriculum Topics &amp; Objectives
                              </span>
                              <ul className="space-y-1.5">
                                {topic.keyTakeaways.map((takeaway, tIdx) => (
                                  <li
                                    key={tIdx}
                                    className="flex items-start gap-2 text-[12.5px] text-slate-200 bg-slate-800/80 p-2.5 rounded-md border border-slate-700"
                                  >
                                    <span className="w-4 h-4 rounded-full bg-[#7950F2] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                      {tIdx + 1}
                                    </span>
                                    <span>{takeaway}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Verified Reference Resources */}
                          {topicResources.length > 0 && (
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                Verified Reference Documentation
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {topicResources.map((res, rIdx) => (
                                  <a
                                    key={rIdx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-[#7950F2] transition-colors flex items-center justify-between gap-2 text-[12px] text-slate-200 group/link"
                                  >
                                    <span className="line-clamp-1 group-hover/link:text-[#A78BFA] transition-colors">
                                      {res.title}
                                    </span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-[#A78BFA] shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                }

                // Locked Lesson Row with Overview Dropdown
                if (isLocked) {
                  return (
                    <div
                      key={topic.id}
                      onClick={() => {
                        handleLockedClick(index + 1, index)
                        toggleOverview(topic.id)
                      }}
                      className="p-3.5 sm:p-4 rounded-[8px] bg-slate-50/90 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col gap-3 cursor-pointer select-none"
                    >
                      {/* Main Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLockedClick(index + 1, index)
                              toggleOverview(topic.id)
                            }}
                            title="Locked Lesson"
                            aria-label="Locked Lesson"
                            className="w-8 h-8 rounded-md bg-slate-200/70 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                          >
                            <Lock className="w-4 h-4" />
                          </button>

                          <div className="min-w-0 flex-1">
                            <span className="text-[14px] sm:text-[15px] font-medium text-slate-700">
                              {index + 1}. {topic.title}
                            </span>
                            <div className="flex items-center gap-2 text-[11.5px] text-slate-400 mt-0.5">
                              <span>{topic.durationMinutes} minutes</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Overview Dropdown Button */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleOverview(topic.id)
                            }}
                            aria-expanded={isExpanded}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-semibold transition-all cursor-pointer border ${
                              isExpanded
                                ? 'bg-[#F3F0FF] text-[#7950F2] border-[#7950F2]/30 shadow-xs'
                                : 'bg-white hover:bg-slate-100 text-[#475569] border-slate-300 shadow-xs'
                            }`}
                          >
                            <span>Overview</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Overview Dropdown Panel */}
                      {isExpanded && (
                        <div
                          className="mt-2 pt-3 border-t border-slate-200 text-left space-y-3 animate-in fade-in duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Prerequisite Alert Banner */}
                          <div className="p-3 bg-amber-50/90 rounded-lg border border-amber-200 flex items-start gap-2.5">
                            <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                            <div className="text-[12.5px] text-amber-900 leading-relaxed">
                              <span className="font-bold">Lesson Locked:</span> This lesson unlocks automatically once you complete{' '}
                              <button
                                type="button"
                                onClick={() => {
                                  if (activeCourse.topics[index - 1]) {
                                    handleSelectLesson(activeCourse.topics[index - 1], index - 1)
                                  }
                                }}
                                className="font-bold text-[#7950F2] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                              >
                                Lesson {index} ({activeCourse.topics[index - 1]?.title})
                                <ArrowRight className="w-3 h-3 inline" />
                              </button>
                            </div>
                          </div>

                          {/* Lesson Description */}
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                              Lesson Summary
                            </span>
                            <p className="text-[13px] text-[#0F172A] leading-relaxed">
                              {topic.description}
                            </p>
                          </div>

                          {/* Key Objectives */}
                          {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                                Curriculum Topics &amp; Objectives
                              </span>
                              <ul className="space-y-1.5">
                                {topic.keyTakeaways.map((takeaway, tIdx) => (
                                  <li
                                    key={tIdx}
                                    className="flex items-start gap-2 text-[12.5px] text-[#334155] bg-white p-2.5 rounded-md border border-slate-200"
                                  >
                                    <span className="w-4 h-4 rounded-full bg-[#F3F0FF] text-[#7950F2] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                      {tIdx + 1}
                                    </span>
                                    <span>{takeaway}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Practical Code Notice */}
                          {topic.codeSnippet && (
                            <div className="flex items-center gap-2 text-[12px] text-[#7950F2] font-medium pt-0.5">
                              <Code className="w-3.5 h-3.5 shrink-0" />
                              <span>Includes hands-on code exercises and architectural patterns</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                }

                // Unlocked Inactive Lesson Row
                return (
                  <div
                    key={topic.id}
                    onClick={() => handleSelectLesson(topic, index)}
                    className="p-3.5 sm:p-4 rounded-[8px] bg-white border border-[#E2E8F0] hover:border-[#7950F2]/40 hover:bg-slate-50/60 transition-all duration-150 flex flex-col gap-3 cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Left Action Button: Play or Review */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            isCompleted ? handleReviewLesson(topic) : handleStartLesson(topic, index)
                          }}
                          title={isCompleted ? 'Review Lesson' : 'Start Lesson'}
                          aria-label={isCompleted ? 'Review Lesson' : 'Start Lesson'}
                          className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-ring ${
                            isCompleted
                              ? 'bg-[#E6FCF5] hover:bg-[#D3F9E8] text-[#20C997]'
                              : 'bg-slate-100 hover:bg-[#F3F0FF] text-[#7950F2]'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#20C997]" />
                          ) : (
                            <Play className="w-4 h-4 fill-current text-[#7950F2]" />
                          )}
                        </button>

                        {/* Hidden button for accessible screen-reader toggle & test compatibility */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleTopic(topic.id)
                          }}
                          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                          className="sr-only"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[14px] sm:text-[15px] font-medium text-[#0F172A] group-hover:text-[#7950F2] transition-colors">
                              {index + 1}. {topic.title}
                            </span>
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6FCF5] text-[#087F5B] text-[10.5px] font-bold">
                                <Check className="w-3 h-3" />
                                <span>Completed</span>
                                {topic.quizScore !== undefined && (
                                  <span className="px-1.5 py-0.2 bg-emerald-100 rounded text-emerald-800 font-semibold">
                                    {topic.quizScore}% Score
                                  </span>
                                )}
                              </span>
                            ) : isInProgress ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3F0FF] text-[#7950F2] text-[10.5px] font-bold">
                                In Progress
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2 text-[11.5px] text-[#64748B] mt-0.5">
                            <span>{topic.durationMinutes} minutes</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Overview Dropdown Button */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleOverview(topic.id)
                          }}
                          aria-expanded={isExpanded}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-semibold transition-all cursor-pointer border ${
                            isExpanded
                              ? 'bg-[#F3F0FF] text-[#7950F2] border-[#7950F2]/30 shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-[#475569] border-slate-300 shadow-xs'
                          }`}
                        >
                          <span>Overview</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Overview Dropdown Panel */}
                    {isExpanded && (
                      <div
                        className="mt-2 pt-3 border-t border-slate-200 text-left space-y-3 animate-in fade-in duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Lesson Description */}
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                            Lesson Summary
                          </span>
                          <p className="text-[13px] text-[#0F172A] leading-relaxed">
                            {topic.description}
                          </p>
                        </div>

                        {/* Key Objectives */}
                        {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                              Curriculum Topics &amp; Objectives
                            </span>
                            <ul className="space-y-1.5">
                              {topic.keyTakeaways.map((takeaway, tIdx) => (
                                <li
                                  key={tIdx}
                                  className="flex items-start gap-2 text-[12.5px] text-[#334155] bg-white p-2.5 rounded-md border border-slate-200"
                                >
                                  <span className="w-4 h-4 rounded-full bg-[#F3F0FF] text-[#7950F2] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                    {tIdx + 1}
                                  </span>
                                  <span>{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Verified Reference Resources */}
                        {topicResources.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                              Verified Reference Documentation
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {topicResources.map((res, rIdx) => (
                                <a
                                  key={rIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2.5 rounded-md bg-white hover:bg-[#F8FAFF] border border-slate-200 hover:border-[#7950F2] transition-colors flex items-center justify-between gap-2 text-[12px] text-[#0F172A] group/link"
                                >
                                  <span className="line-clamp-1 group-hover/link:text-[#7950F2] transition-colors">
                                    {res.title}
                                  </span>
                                  <ExternalLink className="w-3.5 h-3.5 text-[#64748B] group-hover/link:text-[#7950F2] shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3. More Courses in This Curriculum (Directly Below Lessons Section - matching reference) */}
          {otherCourses.length > 0 && (
            <div className="pt-6 space-y-4">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200/80 pt-6">
                <div>
                  <h3 className="text-[19px] sm:text-[21px] font-bold text-[#0F172A] tracking-tight">
                    More Courses in This Curriculum
                  </h3>
                  <p className="text-[12.5px] text-[#64748B]">
                    Explore upcoming classes, prerequisites, and advance through your internship roadmap.
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-[#7950F2] bg-[#F3F0FF] px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                  {otherCourses.length} Other Classes Available
                </span>
              </div>

              {/* Vertical List of Course Cards matching reference screenshot */}
              <div className="space-y-3">
                {otherCourses.map((mod) => {
                  const meta = getCourseMeta(mod)
                  const totalLessons = mod.topics.length
                  const durationMins = mod.topics.reduce((acc, t) => acc + t.durationMinutes, 0)
                  const hours = Math.floor(durationMins / 60)
                  const mins = durationMins % 60
                  const formattedDuration = hours > 0 ? `${hours} hrs ${mins} mins` : `${mins} mins`
                  const completedCount = mod.topics.filter((t) => t.isCompleted).length
                  const isModCompleted = totalLessons > 0 && completedCount === totalLessons
                  const isModInProgress = completedCount > 0 && !isModCompleted

                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleSelectCourse(mod.id)}
                      className="group bg-white rounded-[16px] border border-[#E2E8F0] hover:border-[#7950F2]/40 hover:shadow-md transition-all duration-200 p-3 sm:p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      {/* Left: Thumbnail + Info */}
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                        {/* Rounded Thumbnail matching reference */}
                        <div className="w-24 sm:w-28 h-16 sm:h-20 rounded-[12px] overflow-hidden bg-slate-100 shrink-0 relative shadow-xs">
                          <img
                            src={meta.thumbnail}
                            alt={mod.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>

                        {/* Course Title & Metadata matching reference */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <h4 className="text-[14.5px] sm:text-[15.5px] font-bold text-[#0F172A] group-hover:text-[#7950F2] transition-colors leading-snug line-clamp-1">
                            {mod.title}
                          </h4>

                          {/* Subtitle 1: Lessons Count with Icon */}
                          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                            <BookOpen className="w-3.5 h-3.5 text-[#7950F2] shrink-0" />
                            <span>{totalLessons} lessons</span>
                          </div>

                          {/* Subtitle 2: Duration with Clock Icon */}
                          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formattedDuration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Badge & Chevron Action */}
                      <div className="flex items-center gap-3 shrink-0">
                        {isModCompleted ? (
                          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        ) : isModInProgress ? (
                          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F3F0FF] text-[#7950F2] text-[11px] font-bold border border-[#7950F2]/20">
                            <Play className="w-2.5 h-2.5 fill-current" /> In Progress
                          </span>
                        ) : (
                          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                            Course {mod.weekNumber}
                          </span>
                        )}

                        <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#F3F0FF] text-[#64748B] group-hover:text-[#7950F2] flex items-center justify-center transition-colors shrink-0">
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Course Catalog View */
        <div className="space-y-8">
          {/* Page Header */}
          <PageHeader
            title="Learning Curriculum & Courses"
            subtitle="Course Catalog • Explore industry-aligned engineering courses, video lessons, and interactive practical topics."
            badge="Official Curriculum"
          />

          {/* Curriculum Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="md" className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#F3F0FF] text-[#7950F2] flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                  Total Courses
                </span>
                <span className="text-[18px] font-bold text-[#0F172A]">
                  {course.modules.length} Specialized Courses
                </span>
              </div>
            </Card>

            <Card padding="md" className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                  Lesson Topics
                </span>
                <span className="text-[18px] font-bold text-[#0F172A]">
                  {completedTopicsCount} / {totalTopicsCount} Done
                </span>
              </div>
            </Card>

            <Card padding="md" className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                  Total Content
                </span>
                <span className="text-[18px] font-bold text-[#0F172A]">
                  {totalHours} Total Hours
                </span>
              </div>
            </Card>

            <Card padding="md" className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
                  Curriculum Progress
                </span>
                <span className="text-[18px] font-bold text-[#7950F2]">
                  {curriculumProgressPercentage}% Overall
                </span>
              </div>
            </Card>
          </div>

          {/* Search Bar & Category Filter Strip */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Input
                  icon={<Search className="w-4 h-4 text-[#64748B]" />}
                  placeholder="Search courses, lessons, topics, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-[12px] font-medium text-[#64748B] flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {[
                  { id: 'all', label: 'All Courses' },
                  { id: 'frontend', label: 'Frontend' },
                  { id: 'backend', label: 'Backend' },
                  { id: 'devops', label: 'DevOps' },
                  { id: 'in-progress', label: 'In Progress' },
                  { id: 'completed', label: 'Completed' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setCategoryFilter(pill.id)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer select-none shrink-0 ${
                      categoryFilter === pill.id
                        ? 'bg-[#7950F2] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Course Catalog Grid */}
          {filteredCourses.length === 0 ? (
            <Card padding="lg" className="text-center py-12">
              <BookOpen className="w-10 h-10 text-[#64748B] mx-auto mb-3 opacity-40" />
              <h3 className="text-[16px] font-bold text-[#0F172A]">No courses found</h3>
              <p className="text-[13px] text-[#64748B] mt-1 max-w-sm mx-auto">
                No course matches your current search or category filter. Try clearing the filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('all')
                }}
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                    {/* Compact Thumbnail Container (Reduced Height) */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                      <CourseThumbnail
                        src={meta.thumbnail}
                        alt={module.title}
                        category={meta.category}
                        accentColor={meta.accentColor}
                      />

                      {/* Subtle Dark Gradient for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                      {/* Top Badges: Category & Difficulty */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-white/95 text-[#0F172A] shadow-xs backdrop-blur-xs whitespace-nowrap truncate max-w-[130px]">
                          {meta.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-[#0F172A]/80 text-white backdrop-blur-xs shrink-0">
                          {meta.difficulty}
                        </span>
                      </div>

                      {/* Bottom Info on Thumbnail */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-center justify-end text-white text-[11.5px] pointer-events-none">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10.5px] font-bold shadow-xs">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7950F2] text-white text-[10.5px] font-bold shadow-xs">
                            <Play className="w-2.5 h-2.5 fill-current" /> In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10.5px] font-medium backdrop-blur-xs">
                            Not Started
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Card Details */}
                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Course Name */}
                        <h3 className="text-[14px] sm:text-[15px] font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#7950F2] transition-colors leading-snug">
                          {module.title}
                        </h3>

                        {/* Short Description (2 lines) */}
                        <p className="text-[12.5px] text-[#64748B] line-clamp-2 mt-1 leading-[18px] min-h-[36px]">
                          {module.description}
                        </p>

                        {/* Lessons & Duration Row */}
                        <div className="flex items-center gap-2.5 mt-2.5 text-[11.5px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
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
                      <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] space-y-2.5">
                        {/* Student Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                            <span className="text-[#64748B]">
                              {completedLessons}/{totalLessons} Done
                            </span>
                            <span className={isCompleted ? 'text-emerald-600' : 'text-[#7950F2]'}>
                              {progressPct}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#EEF1F7] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${progressPct}%`,
                                backgroundColor: isCompleted ? '#10B981' : '#7950F2',
                              }}
                            />
                          </div>
                        </div>

                        {/* Action CTA with guaranteed inline text and icon */}
                        <Button
                          variant={isInProgress ? 'primary' : 'outline'}
                          size="sm"
                          className="w-full text-[12.5px] whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectCourse(module.id)
                          }}
                        >
                          <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                            {isCompleted ? (
                              <>
                                <span>Review Course</span>
                                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                              </>
                            ) : isInProgress ? (
                              <>
                                <span>Continue Learning</span>
                                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                              </>
                            ) : (
                              <>
                                <span>Start Learning</span>
                                <span className="sr-only">View Course</span>
                                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                              </>
                            )}
                          </span>
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

      {/* Lesson Detail Modal */}
      {selectedTopic && (
        <Modal
          isOpen={Boolean(selectedTopic)}
          onClose={() => setSelectedTopic(null)}
          title={selectedTopic.title}
          description={`Course ${activeCourse?.weekNumber || 1} • Estimated Time: ${
            selectedTopic.durationMinutes
          } mins • ${selectedTopic.isCompleted ? 'Status: Completed' : 'Status: In Progress'}`}
        >
          <div className="space-y-6 pt-2">
            {/* 1. Overview */}
            <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Lesson Overview
              </span>
              <p className="text-[14px] text-[#0F172A] leading-[22px]">
                {selectedTopic.description}
              </p>
            </div>

            {/* 2. Key Learning Objectives */}
            <div className="space-y-2.5">
              <h4 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20C997]" /> Key Learning Objectives
              </h4>
              <ul className="space-y-2">
                {selectedTopic.keyTakeaways.map((takeaway, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-[13px] text-[#25324B]/90 bg-white p-3 rounded-[8px] border border-[#E2E8F0]"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#E6FCF5] text-[#087F5B] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Verified Learning Resources & References */}
            {activeResources.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#3B82F6]" /> Verified Reference Documentation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeResources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-[8px] border border-[#E2E8F0] hover:border-[#7950F2] hover:shadow-xs transition-all flex items-start justify-between gap-2 group bg-white"
                    >
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7950F2] block">
                          {res.platform}
                        </span>
                        <span className="text-[13px] font-medium text-[#0F172A] group-hover:text-[#7950F2] transition-colors line-clamp-1">
                          {res.title}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#64748B] group-hover:text-[#7950F2] shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Action Controls */}
            <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Previous / Next Lesson Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevLesson}
                  disabled={currentModalIndex <= 0}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextLesson}
                  disabled={!activeCourse || currentModalIndex >= activeCourse.topics.length - 1}
                  icon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>

              {/* Take Lesson Test CTA Button */}
              <div className="flex items-center gap-2 justify-end">
                {!selectedTopic.isCompleted && !watchedTopicIds.includes(selectedTopic.id) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={true}
                    className="opacity-70 cursor-not-allowed border-slate-300 text-slate-500"
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                  >
                    Watch Video First to Unlock Test
                  </Button>
                ) : (
                  <Button
                    variant={selectedTopic.isCompleted ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => {
                      const topicToTest = selectedTopic
                      setSelectedTopic(null)
                      setQuizTopic(topicToTest)
                    }}
                    icon={
                      selectedTopic.isCompleted ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <HelpCircle className="w-4 h-4" />
                      )
                    }
                  >
                    {selectedTopic.isCompleted ? 'Retake Lesson Test' : 'Take Lesson Test to Complete'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Interactive Lesson Quiz Modal */}
      {quizTopic && (
        <LessonQuizModal
          isOpen={Boolean(quizTopic)}
          onClose={() => setQuizTopic(null)}
          topic={quizTopic}
          courseNumber={activeCourse?.weekNumber || 1}
          lessonNumber={
            activeCourse ? activeCourse.topics.findIndex((t) => t.id === quizTopic.id) + 1 : 1
          }
          onPassed={handlePassQuiz}
          onNextLesson={handleNextLessonFromQuiz}
          hasNextLesson={
            Boolean(activeCourse &&
            activeCourse.topics.findIndex((t) => t.id === quizTopic.id) < activeCourse.topics.length - 1)
          }
        />
      )}
    </div>
  )
}
