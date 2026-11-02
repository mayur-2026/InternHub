import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  Settings,
  Check,
  ChevronRight,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lock,
} from 'lucide-react'
import { Button } from '../ui/Button'
import type { Topic } from '../../types'

const LOCAL_VIDEO_SOURCES = [
  '/videos/lesson-1.mp4',
  '/videos/lesson-2.mp4',
  '/videos/lesson-3.mp4',
  '/videos/lesson-4.mp4',
]

const FALLBACK_ONLINE_SOURCES = [
  'https://raw.githubusercontent.com/mdn/learning-area/master/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
]

const ALL_VIDEO_SOURCES = [...LOCAL_VIDEO_SOURCES, ...FALLBACK_ONLINE_SOURCES]

const SPEED_RATES = [1, 1.25, 1.5, 2, 0.75]

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
  courseTitle,
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(topic.durationMinutes * 60 || 201)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [captionsEnabled, setCaptionsEnabled] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const [sourceIndex, setSourceIndex] = useState(lessonIndex % LOCAL_VIDEO_SOURCES.length)
  const [isSimulatedPlayback, setIsSimulatedPlayback] = useState(false)
  const [localWatched, setLocalWatched] = useState(hasWatched)

  useEffect(() => {
    setLocalWatched(hasWatched)
    setIsPlaying(false)
    setCurrentTime(0)
    setIsSimulatedPlayback(false)
    setSourceIndex(lessonIndex % LOCAL_VIDEO_SOURCES.length)
  }, [hasWatched, topic.id, lessonIndex])

  const handleVideoComplete = useCallback(() => {
    setLocalWatched(true)
    onVideoWatched(topic.id)
  }, [onVideoWatched, topic.id])

  // Current video source
  const videoSrc = ALL_VIDEO_SOURCES[sourceIndex % ALL_VIDEO_SOURCES.length]

  const handleVideoError = () => {
    if (sourceIndex < ALL_VIDEO_SOURCES.length - 1) {
      setSourceIndex((prev) => prev + 1)
    } else {
      setIsSimulatedPlayback(true)
    }
  }

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (isSimulatedPlayback) {
      setIsPlaying((prev) => !prev)
      return
    }

    if (!videoRef.current) {
      setIsSimulatedPlayback(true)
      setIsPlaying((prev) => !prev)
      return
    }

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((err) => {
            console.warn('Direct video play error, attempting muted or simulation:', err)
            if (videoRef.current) {
              videoRef.current.muted = true
              setIsMuted(true)
              videoRef.current
                .play()
                .then(() => {
                  setIsPlaying(true)
                })
                .catch(() => {
                  setIsSimulatedPlayback(true)
                  setIsPlaying(true)
                })
            } else {
              setIsSimulatedPlayback(true)
              setIsPlaying(true)
            }
          })
      } else {
        setIsPlaying(true)
      }
    }
  }, [isPlaying, isSimulatedPlayback])

  // Simulated interactive lecture playback timer
  useEffect(() => {
    if (!isSimulatedPlayback || !isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const nextTime = prev + 0.5 * playbackRate
        if (nextTime >= duration) {
          setIsPlaying(false)
          handleVideoComplete()
          return duration
        }
        if (!localWatched && (nextTime >= 15 || nextTime >= duration * 0.8)) {
          handleVideoComplete()
        }
        return nextTime
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isSimulatedPlayback, isPlaying, playbackRate, duration, localWatched, handleVideoComplete])

  // 15 seconds skip backward
  const handleSkipBackward = useCallback(() => {
    const newTime = Math.max(0, currentTime - 15)
    if (videoRef.current && !isSimulatedPlayback) {
      videoRef.current.currentTime = newTime
    }
    setCurrentTime(newTime)
  }, [currentTime, isSimulatedPlayback])

  // Playback speed cycle: 1x -> 1.25x -> 1.5x -> 2x -> 0.75x
  const handleCycleSpeed = useCallback(() => {
    const nextIdx = (SPEED_RATES.indexOf(playbackRate) + 1) % SPEED_RATES.length
    const nextRate = SPEED_RATES[nextIdx]
    setPlaybackRate(nextRate)
    if (videoRef.current && !isSimulatedPlayback) {
      videoRef.current.playbackRate = nextRate
    }
  }, [playbackRate, isSimulatedPlayback])

  // Mute toggle
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    const newMuted = !isMuted
    videoRef.current.muted = newMuted
    setIsMuted(newMuted)
  }, [isMuted])

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

  // Video time update listener
  const handleTimeUpdate = () => {
    if (!videoRef.current || isSimulatedPlayback) return
    const cur = videoRef.current.currentTime
    const dur = videoRef.current.duration || duration
    setCurrentTime(cur)
    if (!localWatched && dur > 0 && (cur >= dur * 0.8 || cur >= 15)) {
      handleVideoComplete()
    }
  }

  // Video metadata loaded
  const handleLoadedMetadata = () => {
    if (!videoRef.current || isSimulatedPlayback) return
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration)
    }
  }

  // Scrubber click/seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const targetTime = pos * duration
    if (videoRef.current && !isSimulatedPlayback) {
      videoRef.current.currentTime = targetTime
    }
    setCurrentTime(targetTime)
    if (!localWatched && (pos >= 0.8 || targetTime >= 15)) {
      handleVideoComplete()
    }
  }

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00'
    const mins = Math.floor(secs / 60)
    const remainingSecs = Math.floor(secs % 60)
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="space-y-4">
      {/* 1. Real Video Player Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] bg-[#0A0D14] rounded-[14px] overflow-hidden shadow-2xl select-none group border border-slate-800"
        onMouseEnter={() => setIsControlsVisible(true)}
        onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
      >
        {/* Real HTML5 Video Element or Interactive Lecture Canvas */}
        {!isSimulatedPlayback ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster="/images/video-poster.jpg"
            playsInline
            className="w-full h-full object-cover cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleVideoError}
            onEnded={() => {
              setIsPlaying(false)
              handleVideoComplete()
            }}
          />
        ) : (
          /* Interactive Lecture Canvas & Animated Visualizer */
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0B0F19] via-[#1E1B4B] to-[#0A0D14] text-white p-6 text-center select-none cursor-pointer z-10"
          >
            {/* Visualizer and Slide Info */}
            <div className="w-14 h-14 rounded-2xl bg-[#7950F2]/25 border border-[#7950F2]/40 flex items-center justify-center mb-3 shadow-lg">
              <BookOpen className="w-7 h-7 text-[#A78BFA]" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A78BFA] bg-[#7950F2]/15 px-3 py-0.5 rounded-full border border-[#7950F2]/30 mb-1.5 shadow-2xs">
              {courseTitle} • Lesson {lessonIndex + 1}
            </span>

            <h4 className="text-base sm:text-xl font-bold text-white max-w-lg leading-snug">
              {topic.title}
            </h4>

            <p className="text-xs text-slate-300 max-w-md mt-1 mb-4 leading-relaxed line-clamp-2">
              {topic.description}
            </p>

            {/* Animated Equalizer Waveform while playing */}
            {isPlaying ? (
              <div className="flex items-end gap-1.5 h-7 mb-3">
                <span className="w-1.5 bg-[#00C4FF] rounded-full animate-bounce h-7" style={{ animationDuration: '0.6s' }} />
                <span className="w-1.5 bg-[#7950F2] rounded-full animate-bounce h-4" style={{ animationDuration: '0.8s' }} />
                <span className="w-1.5 bg-[#A78BFA] rounded-full animate-bounce h-6" style={{ animationDuration: '0.5s' }} />
                <span className="w-1.5 bg-[#00C4FF] rounded-full animate-bounce h-3" style={{ animationDuration: '0.7s' }} />
                <span className="w-1.5 bg-[#7950F2] rounded-full animate-bounce h-7" style={{ animationDuration: '0.9s' }} />
              </div>
            ) : (
              <div className="text-[12px] text-slate-400 font-medium mb-3">
                Click Play to start lesson stream
              </div>
            )}

            {!isCompleted && !localWatched && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleVideoComplete()
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#7950F2] hover:bg-[#6741D9] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 border border-white/10 z-20"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Video as Watched &amp; Unlock Test</span>
              </button>
            )}
          </div>
        )}

        {/* Closed Captions Overlay */}
        {captionsEnabled && isPlaying && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/85 text-white px-4 py-1.5 rounded-md text-[13px] font-medium tracking-wide shadow-md pointer-events-none max-w-xl text-center z-25">
            [Narrator] &ldquo;In this lesson, we master {topic.title.toLowerCase()}...&rdquo;
          </div>
        )}

        {/* Big Center Play Button (when paused) - prominently visible and always clickable */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/50 transition-colors cursor-pointer z-30 group"
            aria-label="Play video"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7950F2] hover:bg-[#6741D9] text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-all duration-200 transform group-hover:scale-110 border-2 border-white/40 ring-4 ring-[#7950F2]/40">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
            </div>
            <span className="mt-3 px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[12px] font-bold border border-white/20 shadow-md group-hover:bg-[#7950F2] transition-colors">
              Play Lesson Video
            </span>
          </button>
        )}

        {/* Top Floating Badge: Lesson Title & Watched Status */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none gap-2 z-30">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-[12px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-md">
              Now Playing: Lesson {lessonIndex + 1}
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

        {/* Bottom Custom Video Controls Overlay (always on top z-30) */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-3 px-4 sm:px-5 transition-opacity duration-200 z-30 ${
            isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Interactive Cyan Scrubber Bar */}
          <div
            ref={progressBarRef}
            onClick={handleSeek}
            className="w-full h-1.5 bg-white/25 hover:h-2.5 transition-all rounded-full cursor-pointer relative mb-3 group/scrub"
          >
            {/* Scrubber Progress Fill */}
            <div
              className="h-full bg-[#00C4FF] rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Scrub Thumb */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Bottom Controls Bar: Left & Right clusters */}
          <div className="flex items-center justify-between text-white text-[13px]">
            {/* Left Controls: Play/Pause, Speed, 15s Rewind, Time */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="hover:text-[#00C4FF] transition-colors cursor-pointer p-1"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </button>

              {/* Playback Speed (1x) */}
              <button
                type="button"
                onClick={handleCycleSpeed}
                className="font-bold text-[12px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                title="Playback Speed"
              >
                {playbackRate}x
              </button>

              {/* 15s Skip Backward Button (⟲ 15) */}
              <button
                type="button"
                onClick={handleSkipBackward}
                className="hover:text-[#00C4FF] transition-colors cursor-pointer flex items-center relative p-1"
                title="Rewind 15 seconds"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-[9px] font-extrabold absolute top-2.5 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px]">
                  15
                </span>
              </button>

              {/* Time Indicator: e.g. 1:37 / 3:21 */}
              <span className="text-[12px] font-medium text-white/90 select-none tracking-tight">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls: Mute, Captions, Settings, Fullscreen */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Mute Toggle */}
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

              {/* Subtitles / CC Toggle */}
              <button
                type="button"
                onClick={() => setCaptionsEnabled(!captionsEnabled)}
                className={`p-1 transition-colors cursor-pointer ${
                  captionsEnabled ? 'text-[#00C4FF]' : 'text-white/80 hover:text-white'
                }`}
                title="Subtitles / Closed Captions"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Settings Gear */}
              <button
                type="button"
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`p-1 transition-colors cursor-pointer ${
                  settingsOpen ? 'text-[#00C4FF]' : 'text-white/80 hover:text-white'
                }`}
                title="Video Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
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

        {/* Video Settings Popover */}
        {settingsOpen && (
          <div className="absolute bottom-14 right-4 bg-slate-900/95 border border-slate-700 text-white rounded-lg p-3 shadow-xl backdrop-blur-md z-30 text-xs space-y-2 min-w-[160px]">
            <div className="font-bold text-slate-300 pb-1 border-b border-slate-700">Settings</div>
            <div className="flex items-center justify-between">
              <span>Speed:</span>
              <button
                type="button"
                onClick={handleCycleSpeed}
                className="text-[#00C4FF] font-semibold hover:underline"
              >
                {playbackRate}x
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Quality:</span>
              <span className="text-slate-300">1080p HD (Auto)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Captions:</span>
              <button
                type="button"
                onClick={() => setCaptionsEnabled(!captionsEnabled)}
                className="text-[#00C4FF] font-semibold hover:underline"
              >
                {captionsEnabled ? 'English (On)' : 'Off'}
              </button>
            </div>
          </div>
        )}
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
