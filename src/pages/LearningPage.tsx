import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import type { Topic } from '../types'
import { PageHeader } from '../components/ui/FeedbackStates'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/FormField'
import { CourseVideoPlayer } from '../components/learning/CourseVideoPlayer'
import { LessonQuizModal } from '../components/learning/LessonQuizModal'
import { CourseCard } from '../components/learning/CourseCard'
import { LessonRow } from '../components/learning/LessonRow'
import { LessonDetailModal } from '../components/learning/LessonDetailModal'
import { getCourseMeta } from '../data/courseMeta'
import { loadStoredItem, saveStoredItem } from '../utils/storage'
import { formatDuration } from '../utils/formatters'
import {
  Search,
  BookOpen,
  Clock,
  Filter,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  Trophy,
  Lock,
  ChevronRight,
  Check,
  Play,
} from 'lucide-react'

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

  const watchedStorageKey = isDemo ? 'internhub_demo_watched_videos' : `internhub_watched_videos_${user?.id}`
  const [watchedTopicIds, setWatchedTopicIds] = useState<string[]>(() => {
    return loadStoredItem(watchedStorageKey, [])
  })

  const handleVideoWatched = (topicId: string) => {
    setWatchedTopicIds((prev) => {
      if (prev.includes(topicId)) return prev
      const updated = [...prev, topicId]
      saveStoredItem(watchedStorageKey, updated)
      return updated
    })
  }

  const toggleOverview = (topicId: string) => {
    setExpandedOverviewTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    )
  }

  // Active course module when student navigates into a course
  const activeCourse = useMemo(() => {
    if (!selectedCourseId) return null
    return course.modules.find((m) => m.id === selectedCourseId) || null
  }, [course.modules, selectedCourseId])

  // Sequential lesson locking rule: lesson at index is locked if any preceding lesson is incomplete
  const isLessonLocked = useMemo(() => {
    return (index: number): boolean => {
      if (!activeCourse || index === 0) return false
      for (let j = 0; j < index; j++) {
        if (!activeCourse.topics[j]?.isCompleted) {
          return true
        }
      }
      return false
    }
  }, [activeCourse])

  // Determine currently active lesson for the video player
  const activeTopic = useMemo(() => {
    if (!activeCourse || activeCourse.topics.length === 0) return null
    if (activeTopicId) {
      const found = activeCourse.topics.find((t) => t.id === activeTopicId)
      if (found) return found
    }
    const firstIncomplete = activeCourse.topics.find((t) => !t.isCompleted)
    return firstIncomplete || activeCourse.topics[0]
  }, [activeCourse, activeTopicId])

  // Calculate curriculum aggregate metrics
  const totalMinutes = useMemo(() => {
    return course.modules.reduce(
      (sum, m) => sum + m.topics.reduce((tSum, t) => tSum + t.durationMinutes, 0),
      0
    )
  }, [course.modules])

  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  const otherCourses = useMemo(() => {
    if (!activeCourse) return []
    return course.modules.filter((m) => m.id !== activeCourse.id)
  }, [course.modules, activeCourse])

  // Filter courses in the catalog
  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    return course.modules.filter((mod) => {
      const meta = getCourseMeta(mod)
      const matchesSearch =
        !q ||
        mod.title.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q) ||
        meta.category.toLowerCase().includes(q) ||
        mod.topics.some(
          (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
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

  const scrollToTop = () => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch {
        // Fallback for jsdom in test environments
      }
    }
  }

  const handleSelectCourse = (courseId: string) => {
    setSearchParams({ course: courseId })
    setLockedAlert(null)
    scrollToTop()
  }

  const handleBackToCourses = () => {
    setSearchParams({})
    setLockedAlert(null)
    scrollToTop()
  }

  // Active course metrics
  const activeCourseMeta = activeCourse ? getCourseMeta(activeCourse) : null
  const activeCourseTotal = activeCourse ? activeCourse.topics.length : 0
  const activeCourseDone = activeCourse ? activeCourse.topics.filter((t) => t.isCompleted).length : 0
  const activeCoursePercent =
    activeCourseTotal > 0 ? Math.round((activeCourseDone / activeCourseTotal) * 100) : 0
  const activeCourseDuration = activeCourse
    ? activeCourse.topics.reduce((acc, t) => acc + t.durationMinutes, 0)
    : 0

  const handleLockedClick = (targetLessonNum: number, prereqLessonNum: number) => {
    setLockedAlert({ target: targetLessonNum, prereq: prereqLessonNum })
    setTimeout(() => {
      setLockedAlert(null)
    }, 4500)
  }

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

  const handleToggleTopic = async (topicId: string) => {
    if (savingTopicId) return
    setSavingTopicId(topicId)
    try {
      await toggleTopic(topicId)
      setSelectedTopic((prev) =>
        prev && prev.id === topicId ? { ...prev, isCompleted: !prev.isCompleted } : prev
      )
      setLockedAlert(null)
    } finally {
      setSavingTopicId(null)
    }
  }

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

  const handleContinueLesson = (topic: Topic, index: number) => {
    if (isLessonLocked(index)) {
      handleLockedClick(index + 1, index)
      return
    }
    startTopic(topic.id)
    setActiveTopicId(topic.id)
    setSelectedTopic(topic)
  }

  const handleReviewLesson = (topic: Topic) => {
    setActiveTopicId(topic.id)
    setSelectedTopic(topic)
  }

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

  const currentModalIndex = useMemo(() => {
    if (!selectedTopic || !activeCourse) return -1
    return activeCourse.topics.findIndex((t) => t.id === selectedTopic.id)
  }, [selectedTopic, activeCourse])

  const handlePrevLessonInModal = () => {
    if (!activeCourse || currentModalIndex <= 0) return
    const prevTopic = activeCourse.topics[currentModalIndex - 1]
    if (prevTopic) {
      startTopic(prevTopic.id)
      setActiveTopicId(prevTopic.id)
      setSelectedTopic(prevTopic)
    }
  }

  const handleNextLessonInModal = () => {
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
          {/* Breadcrumb Navigation */}
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

          {/* Course Title & Progress Bar Card */}
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

          {/* Real Video Player Section */}
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

          {/* Lessons in This Class Section */}
          <div className="pt-2 space-y-4">
            <div className="w-full h-1 bg-[#7950F2] rounded-full" />

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
                const prereqTopic = index > 0 ? activeCourse.topics[index - 1] : undefined

                return (
                  <LessonRow
                    key={topic.id}
                    topic={topic}
                    index={index}
                    isActive={isActive}
                    isLocked={isLocked}
                    isInProgress={isInProgress}
                    isExpanded={isExpanded}
                    prereqTopic={prereqTopic}
                    onToggleOverview={toggleOverview}
                    onSelectLesson={handleSelectLesson}
                    onToggleTopic={handleToggleTopic}
                    onStartLesson={handleStartLesson}
                    onContinueLesson={handleContinueLesson}
                    onReviewLesson={handleReviewLesson}
                    onLockedClick={handleLockedClick}
                  />
                )
              })}
            </div>
          </div>

          {/* More Courses in This Curriculum */}
          {otherCourses.length > 0 && (
            <div className="pt-6 space-y-4">
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

              <div className="space-y-3">
                {otherCourses.map((mod) => {
                  const meta = getCourseMeta(mod)
                  const totalLessons = mod.topics.length
                  const durationMins = mod.topics.reduce((acc, t) => acc + t.durationMinutes, 0)
                  const completedCount = mod.topics.filter((t) => t.isCompleted).length
                  const isModCompleted = totalLessons > 0 && completedCount === totalLessons
                  const isModInProgress = completedCount > 0 && !isModCompleted

                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleSelectCourse(mod.id)}
                      className="group bg-white rounded-[16px] border border-[#E2E8F0] hover:border-[#7950F2]/40 hover:shadow-md transition-all duration-200 p-3 sm:p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                        <div className="w-24 sm:w-28 h-16 sm:h-20 rounded-[12px] overflow-hidden bg-slate-100 shrink-0 relative shadow-xs">
                          <img
                            src={meta.thumbnail}
                            alt={mod.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <h4 className="text-[14.5px] sm:text-[15.5px] font-bold text-[#0F172A] group-hover:text-[#7950F2] transition-colors leading-snug line-clamp-1">
                            {mod.title}
                          </h4>

                          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                            <BookOpen className="w-3.5 h-3.5 text-[#7950F2] shrink-0" />
                            <span>{totalLessons} lessons</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formatDuration(durationMins)}</span>
                          </div>
                        </div>
                      </div>

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
          <PageHeader
            title="Learning Curriculum & Courses"
            subtitle="Course Catalog • Explore industry-aligned engineering courses, video lessons, and interactive practical topics."
            badge="Official Curriculum"
          />

          {/* Curriculum Metrics */}
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
              {filteredCourses.map((module) => (
                <CourseCard
                  key={module.id}
                  module={module}
                  onSelect={handleSelectCourse}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lesson Detail Modal */}
      <LessonDetailModal
        topic={selectedTopic}
        courseNumber={activeCourse?.weekNumber || 1}
        currentIndex={currentModalIndex}
        totalTopics={activeCourse?.topics.length || 0}
        hasWatchedVideo={Boolean(
          selectedTopic &&
          (selectedTopic.isCompleted || watchedTopicIds.includes(selectedTopic.id))
        )}
        onClose={() => setSelectedTopic(null)}
        onPrev={handlePrevLessonInModal}
        onNext={handleNextLessonInModal}
        onStartTest={(topic) => {
          setSelectedTopic(null)
          setQuizTopic(topic)
        }}
      />

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
