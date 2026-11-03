import React, { useState } from 'react'
import type { Module } from '../../types'
import { getCourseMeta } from '../../data/courseMeta'
import { Button } from '../ui/Button'
import { BookOpen, Clock, ChevronRight, ArrowRight, Check, Play } from 'lucide-react'

interface CourseCardProps {
  module: Module
  onSelect: (moduleId: string) => void
}

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
        style={{ borderBottom: `3px solid ${accentColor}` }}
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

export const CourseCard: React.FC<CourseCardProps> = ({ module, onSelect }) => {
  const meta = getCourseMeta(module)
  const totalLessons = module.topics.length
  const completedLessons = module.topics.filter((t) => t.isCompleted).length
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const isCompleted = progressPct === 100
  const isInProgress = progressPct > 0 && !isCompleted
  const durationMins = module.topics.reduce((acc, t) => acc + t.durationMinutes, 0)

  return (
    <div
      onClick={() => onSelect(module.id)}
      className="group bg-white rounded-[14px] border border-[#E2E8F0] hover:border-[#7950F2]/40 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden text-left shadow-xs cursor-pointer"
    >
      {/* Compact Thumbnail Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
        <CourseThumbnail
          src={meta.thumbnail}
          alt={module.title}
          category={meta.category}
          accentColor={meta.accentColor}
        />

        {/* Subtle Dark Gradient for text readability */}
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

        {/* Bottom Status on Thumbnail */}
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

          {/* Short Description */}
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

          {/* Action CTA Button */}
          <Button
            variant={isInProgress ? 'primary' : 'outline'}
            size="sm"
            className="w-full text-[12.5px] whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(module.id)
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
}

