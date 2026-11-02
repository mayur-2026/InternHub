import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Play,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Check,
  ChevronRight,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lock,
} from 'lucide-react'
import { Button } from '../ui/Button'
import type { Topic } from '../../types'

interface CourseVideoPlayerProps {
  topic: Topic
  lessonIndex: number
  totalLessons: number
  courseTitle: string
  isCompleted: boolean
  isSaving: boolean
  hasWatched: boolean
  onVideoWatched: (topicId: string) => void
  onStartTest: () => void
  onNextLesson?: () => void
  hasNextLesson?: boolean
  nextLessonTitle?: string
  onOpenDetails?: () => void
}

export const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({
  topic,
  lessonIndex,
  totalLessons,
  courseTitle: _courseTitle,
  isCompleted,
  hasWatched,
  onVideoWatched,
  onStartTest,
  onNextLesson,
  hasNextLesson = false,
  nextLessonTitle,
  onOpenDetails,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [localWatched, setLocalWatched] = useState(hasWatched)

  useEffect(() => {
    setLocalWatched(hasWatched)
  }, [hasWatched, topic.id, lessonIndex])

  const handleVideoComplete = useCallback(() => {
    setLocalWatched(true)
    onVideoWatched(topic.id)
  }, [onVideoWatched, topic.id])

  // Static play button click handler — validates video viewing and unlocks test
  const handlePlayClick = () => {
    handleVideoComplete()
  }

  // Mute toggle
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(() => {})
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch(() => {})
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* 1. Static Video Player Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] bg-[#0A0D14] rounded-[14px] overflow-hidden shadow-2xl select-none border border-slate-800"
      >
        {/* Static Video Poster Image Background */}
        <img
          src="/images/video-poster.jpg"
          alt={topic.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

        {/* Top Floating Badge: Lesson Title & Watched Status */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none gap-2 z-20">
          <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-[12px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-md">
              Video Player • Lesson {lessonIndex + 1}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 bg-emerald-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" /> Completed
              </span>
            ) : localWatched ? (
              <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Check className="w-3 h-3" /> Video Watched • Test Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-black/80 text-amber-300 border border-amber-400/40 text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm">
                <Lock className="w-3 h-3 text-amber-400" /> Watch Video to Unlock Test
              </span>
            )}
          </div>
        </div>

        {/* Static Center Play Button */}
        <button
          type="button"
          onClick={handlePlayClick}
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-20 group"
          aria-label="Play video"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7950F2] hover:bg-[#6741D9] text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-all duration-200 transform group-hover:scale-105 border-2 border-white/40 ring-4 ring-[#7950F2]/40">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
          </div>
          <span className="mt-3 px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[12px] font-bold border border-white/20 shadow-md group-hover:bg-[#7950F2] transition-colors">
            {localWatched ? 'Rewatch Lesson Video' : 'Play Lesson Video & Unlock Test'}
          </span>
        </button>

        {/* Static Bottom Custom Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-3 px-4 sm:px-5 z-20">
          {/* Static Cyan Scrubber Bar */}
          <div className="w-full h-1.5 bg-white/25 rounded-full relative mb-3">
            <div
              className="h-full bg-[#00C4FF] rounded-full relative"
              style={{ width: localWatched ? '100%' : '0%' }}
            />
          </div>

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-between text-white text-[13px]">
            {/* Left Controls: Play button & Duration */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handlePlayClick}
                className="hover:text-[#00C4FF] transition-colors cursor-pointer p-1"
                aria-label="Play video"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>

              <span className="font-bold text-[12px] px-2 py-0.5 rounded bg-white/10 select-none">
                1x
              </span>

              <span className="text-[12px] font-medium text-white/90 select-none">
                {localWatched ? `${topic.durationMinutes}:00` : '0:00'} / {topic.durationMinutes}:00
              </span>
            </div>

            {/* Right Controls: Mute, Fullscreen */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <button
                type="button"
                onClick={toggleMute}
                className="hover:text-[#00C4FF] transition-colors cursor-pointer p-1"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="hover:text-[#00C4FF] transition-colors cursor-pointer p-1"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Lesson Controls & Action Bar directly below the video */}
      <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded-[4px] bg-[#F3F0FF] text-[#7950F2] text-[11px] font-bold">
              Lesson {lessonIndex + 1} of {totalLessons}
            </span>
            <span className="text-[12px] font-medium text-[#64748B]">
              • {topic.durationMinutes} minutes
            </span>
          </div>

          <h3 className="text-[17px] font-bold text-[#0F172A] leading-snug">
            Current Video: Lesson {lessonIndex + 1}
          </h3>
          <p className="text-[13px] text-[#64748B] mt-1 line-clamp-2">
            {topic.description}
          </p>
        </div>

        {/* Action Buttons: Lesson Notes & Take Test */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onOpenDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenDetails}
              className="text-[12.5px] font-medium"
              icon={<BookOpen className="w-3.5 h-3.5" />}
            >
              Lesson Notes &amp; Docs
            </Button>
          )}

          {/* Take Lesson Test CTA (Strictly requires watching video first) */}
          <div className="flex flex-col sm:items-end">
            <Button
              variant={isCompleted ? 'secondary' : localWatched ? 'primary' : 'outline'}
              size="sm"
              disabled={!isCompleted && !localWatched}
              onClick={onStartTest}
              className={`text-[12.5px] font-semibold shadow-xs ${
                !isCompleted && !localWatched
                  ? 'opacity-70 cursor-not-allowed border-slate-300 text-slate-500 bg-slate-50'
                  : ''
              }`}
              icon={
                isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : !localWatched ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <HelpCircle className="w-3.5 h-3.5" />
                )
              }
            >
              {isCompleted
                ? 'Test Passed (Retake)'
                : !localWatched
                ? 'Watch Video to Unlock Test'
                : 'Take Lesson Test to Complete'}
            </Button>
            {!isCompleted && !localWatched && (
              <span className="text-[10.5px] text-amber-700 font-medium mt-1">
                Watch video to unlock knowledge test
              </span>
            )}
          </div>

          {/* Proceed to Next Lesson Button (enabled once completed) */}
          {hasNextLesson && onNextLesson && isCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNextLesson}
              title={nextLessonTitle ? `Proceed to: ${nextLessonTitle}` : 'Proceed to following lesson'}
              className="text-[12.5px] font-semibold text-[#0F172A]"
            >
              <span className="inline-flex items-center gap-1">
                <span>Proceed to Lesson {lessonIndex + 2}</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
