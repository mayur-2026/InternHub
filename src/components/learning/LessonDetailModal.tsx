import React, { useMemo } from 'react'
import type { Topic } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { getTopicResources } from '../../data/learningResources'
import {
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  Lock,
  HelpCircle,
} from 'lucide-react'

interface LessonDetailModalProps {
  topic: Topic | null
  courseNumber: number
  currentIndex: number
  totalTopics: number
  hasWatchedVideo: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onStartTest: (topic: Topic) => void
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  topic,
  courseNumber,
  currentIndex,
  totalTopics,
  hasWatchedVideo,
  onClose,
  onPrev,
  onNext,
  onStartTest,
}) => {
  const activeResources = useMemo(() => {
    if (!topic) return []
    return getTopicResources(topic.id, topic.resourceLink)
  }, [topic])

  if (!topic) return null

  return (
    <Modal
      isOpen={Boolean(topic)}
      onClose={onClose}
      title={topic.title}
      description={`Course ${courseNumber} • Estimated Time: ${
        topic.durationMinutes
      } mins • ${topic.isCompleted ? 'Status: Completed' : 'Status: In Progress'}`}
    >
      <div className="space-y-6 pt-2">
        {/* 1. Overview */}
        <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            Lesson Overview
          </span>
          <p className="text-[14px] text-[#0F172A] leading-[22px]">
            {topic.description}
          </p>
        </div>

        {/* 2. Key Learning Objectives */}
        <div className="space-y-2.5">
          <h4 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#20C997]" /> Key Learning Objectives
          </h4>
          <ul className="space-y-2">
            {topic.keyTakeaways.map((takeaway, idx) => (
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
              onClick={onPrev}
              disabled={currentIndex <= 0}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={currentIndex >= totalTopics - 1}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>

          {/* Take Lesson Test CTA Button */}
          <div className="flex items-center gap-2 justify-end">
            {!topic.isCompleted && !hasWatchedVideo ? (
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
                variant={topic.isCompleted ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => onStartTest(topic)}
                icon={
                  topic.isCompleted ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <HelpCircle className="w-4 h-4" />
                  )
                }
              >
                {topic.isCompleted ? 'Retake Lesson Test' : 'Take Lesson Test to Complete'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

