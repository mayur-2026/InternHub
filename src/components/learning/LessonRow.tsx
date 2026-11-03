import React from 'react'
import type { Topic } from '../../types'
import { getTopicResources } from '../../data/learningResources'
import {
  CheckCircle2,
  Check,
  Play,
  Pause,
  Lock,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Code,
} from 'lucide-react'

interface LessonRowProps {
  topic: Topic
  index: number
  isActive: boolean
  isLocked: boolean
  isInProgress: boolean
  isExpanded: boolean
  prereqTopic?: Topic
  onToggleOverview: (topicId: string) => void
  onSelectLesson: (topic: Topic, index: number) => void
  onToggleTopic: (topicId: string) => void
  onStartLesson: (topic: Topic, index: number) => void
  onContinueLesson: (topic: Topic, index: number) => void
  onReviewLesson: (topic: Topic) => void
  onLockedClick: (targetLessonNum: number, prereqLessonNum: number) => void
}

export const LessonRow: React.FC<LessonRowProps> = ({
  topic,
  index,
  isActive,
  isLocked,
  isInProgress,
  isExpanded,
  prereqTopic,
  onToggleOverview,
  onSelectLesson,
  onToggleTopic,
  onStartLesson,
  onContinueLesson,
  onReviewLesson,
  onLockedClick,
}) => {
  const isCompleted = topic.isCompleted
  const topicResources = getTopicResources(topic.id, topic.resourceLink)

  // 1. Active Lesson (Dark Highlight Bar)
  if (isActive) {
    return (
      <div className="p-3.5 sm:p-4 rounded-[8px] bg-[#0F172A] text-white flex flex-col gap-3 shadow-md border border-slate-800 transition-all select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onContinueLesson(topic, index)
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
              onClick={() => onToggleTopic(topic.id)}
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

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleOverview(topic.id)
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

        {isExpanded && (
          <div
            className="mt-2 pt-3 border-t border-slate-700/80 text-left space-y-3 animate-in fade-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Lesson Summary
              </span>
              <p className="text-[13px] text-slate-200 leading-relaxed">
                {topic.description}
              </p>
            </div>

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

  // 2. Locked Lesson Row
  if (isLocked) {
    return (
      <div
        onClick={() => {
          onLockedClick(index + 1, index)
          onToggleOverview(topic.id)
        }}
        className="p-3.5 sm:p-4 rounded-[8px] bg-slate-50/90 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col gap-3 cursor-pointer select-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onLockedClick(index + 1, index)
                onToggleOverview(topic.id)
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

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleOverview(topic.id)
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
                {prereqTopic && (
                  <button
                    type="button"
                    onClick={() => onSelectLesson(prereqTopic, index - 1)}
                    className="font-bold text-[#7950F2] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                  >
                    Lesson {index} ({prereqTopic.title})
                    <ArrowRight className="w-3 h-3 inline" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Lesson Summary
              </span>
              <p className="text-[13px] text-[#0F172A] leading-relaxed">
                {topic.description}
              </p>
            </div>

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

  // 3. Unlocked Standard Lesson Row
  return (
    <div
      onClick={() => onSelectLesson(topic, index)}
      className="p-3.5 sm:p-4 rounded-[8px] bg-white border border-[#E2E8F0] hover:border-[#7950F2]/40 hover:bg-slate-50/60 transition-all duration-150 flex flex-col gap-3 cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              isCompleted ? onReviewLesson(topic) : onStartLesson(topic, index)
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
              onToggleTopic(topic.id)
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

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleOverview(topic.id)
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

      {isExpanded && (
        <div
          className="mt-2 pt-3 border-t border-slate-200 text-left space-y-3 animate-in fade-in duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
              Lesson Summary
            </span>
            <p className="text-[13px] text-[#0F172A] leading-relaxed">
              {topic.description}
            </p>
          </div>

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
}

