import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  HelpCircle,
  Award,
  XCircle,
} from 'lucide-react'
import type { Topic } from '../../types'
import { getLessonQuiz } from '../../data/lessonQuizzes'

interface LessonQuizModalProps {
  isOpen: boolean
  onClose: () => void
  topic: Topic
  courseNumber: number
  lessonNumber: number
  onPassed: (topicId: string, score: number) => Promise<void> | void
  onNextLesson?: () => void
  hasNextLesson?: boolean
}

export const LessonQuizModal: React.FC<LessonQuizModalProps> = ({
  isOpen,
  onClose,
  topic,
  courseNumber,
  lessonNumber,
  onPassed,
  onNextLesson,
  hasNextLesson = false,
}) => {
  const quizQuestions = getLessonQuiz(topic)
  const totalQuestions = quizQuestions.length

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [validationWarning, setValidationWarning] = useState<string | null>(null)
  const [unansweredIndices, setUnansweredIndices] = useState<number[]>([])

  const answeredCount = Object.keys(selectedAnswers).length
  const allAnswered = answeredCount === totalQuestions && quizQuestions.every((_, idx) => selectedAnswers[idx] !== undefined)

  // Compute test results & score
  const correctCount = quizQuestions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc
  }, 0)

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100)
  const PASSING_THRESHOLD = 80
  const isPassed = isSubmitted && scorePercentage >= PASSING_THRESHOLD

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted && isPassed) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }))
    // Clear validation warning for this question
    setUnansweredIndices((prev) => prev.filter((idx) => idx !== qIdx))
    if (unansweredIndices.length <= 1) {
      setValidationWarning(null)
    }
  }

  const handleSubmit = async (forceSubmit = false) => {
    if (isSaving) return

    // Find any unanswered questions
    if (!allAnswered && !forceSubmit) {
      const missing = quizQuestions
        .map((_, idx) => idx)
        .filter((idx) => selectedAnswers[idx] === undefined)
      setUnansweredIndices(missing)
      setValidationWarning(
        `Please answer Question ${missing[0] + 1} before submitting (${answeredCount} of ${totalQuestions} answered).`
      )
      // Smooth scroll to the first unanswered question
      const missingElem = document.getElementById(`quiz-question-${missing[0]}`)
      if (missingElem && typeof missingElem.scrollIntoView === 'function') {
        missingElem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setValidationWarning(null)
    setUnansweredIndices([])
    setIsSubmitted(true)

    // Passing threshold >= 80% (e.g. 4 of 5 or 5 of 5)
    if (scorePercentage >= PASSING_THRESHOLD) {
      setIsSaving(true)
      try {
        await onPassed(topic.id, scorePercentage)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setIsSubmitted(false)
    setValidationWarning(null)
    setUnansweredIndices([])
  }

  const handleProceedNext = () => {
    onClose()
    if (onNextLesson) {
      onNextLesson()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lesson ${lessonNumber} Knowledge Check`}
      description={`Course ${courseNumber} • ${topic.title}`}
    >
      <div className="space-y-6 pt-2">
        {/* Pre-Test Instructions Banner */}
        {!isSubmitted ? (
          <div className="p-3.5 bg-[#F3F0FF] rounded-xl border border-[#7950F2]/20 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#7950F2] mt-0.5 shrink-0" />
            <div className="text-[13px] text-[#25324B] flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                <span className="font-semibold text-[#7950F2]">
                  Test Instructions ({totalQuestions} Questions):
                </span>
                <span className="text-[11.5px] font-bold text-[#7950F2] bg-white px-2 py-0.5 rounded-full border border-[#7950F2]/20 shadow-2xs">
                  {answeredCount} of {totalQuestions} answered
                </span>
              </div>
              <p className="text-[12.5px] text-[#475569]">
                Score 80% or higher ({Math.ceil(totalQuestions * 0.8)}/{totalQuestions} correct) to verify your comprehension. Upon passing, your score will be recorded, this lesson will be marked completed, and the next lesson will unlock!
              </p>
              {topic.quizScore !== undefined && (
                <div className="mt-2 text-[11.5px] text-[#7950F2] font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Previous Recorded Score: {topic.quizScore}%</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Minimized Post-Test Score Strip */
          <div
            className={`p-3 sm:px-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
              isPassed
                ? 'bg-emerald-50/80 border-emerald-300'
                : 'bg-amber-50/80 border-amber-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Compact Score Badge */}
              <div
                className={`px-3 py-1.5 rounded-lg text-white font-extrabold text-[16px] shrink-0 flex items-baseline gap-1 shadow-2xs ${
                  isPassed ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              >
                <span>{scorePercentage}%</span>
                <span className="text-[9.5px] uppercase opacity-90 font-semibold tracking-wider">Score</span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[13.5px] text-[#0F172A] flex items-center gap-1.5">
                    {isPassed ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{scorePercentage === 100 ? 'Perfect Score!' : 'Test Passed!'}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Needs Retake</span>
                      </>
                    )}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[12px] font-medium text-slate-600">
                    {correctCount} of {totalQuestions} Correct
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[12px] text-slate-500">
                    {isPassed ? `+${scorePercentage} pts earned` : 'Minimum 80% (4/5) required'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <span
                className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                  isPassed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {isPassed ? 'Lesson Completed' : 'Score < 80%'}
              </span>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-5">
          {quizQuestions.map((q, qIdx) => {
            const userAnswer = selectedAnswers[qIdx]
            const isCorrect = isSubmitted && userAnswer === q.correctIndex

            return (
              <div
                key={q.id}
                id={`quiz-question-${qIdx}`}
                className={`p-4 rounded-xl border transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-rose-300 bg-rose-50/20'
                    : unansweredIndices.includes(qIdx)
                    ? 'border-amber-400 bg-amber-50/25 ring-2 ring-amber-300/60 shadow-xs'
                    : 'border-[#E2E8F0] bg-white'
                }`}
              >
                {/* Question Prompt */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-start gap-2">
                    <span
                      className={`w-5 h-5 rounded-full font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 ${
                        unansweredIndices.includes(qIdx) && !isSubmitted
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {qIdx + 1}
                    </span>
                    <h4 className="text-[13.5px] font-semibold text-[#0F172A] leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  {unansweredIndices.includes(qIdx) && !isSubmitted && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 bg-amber-100 text-amber-800 border border-amber-300/80">
                      Answer Required
                    </span>
                  )}

                  {isSubmitted && (
                    <span
                      className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2 pl-7">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx
                    const isTheCorrectOption = isSubmitted && optIdx === q.correctIndex

                    return (
                      <label
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-[13px] transition-all cursor-pointer select-none ${
                          isTheCorrectOption
                            ? 'border-emerald-500 bg-emerald-50 text-[#087F5B] font-medium'
                            : isSubmitted && isSelected && !isCorrect
                            ? 'border-rose-400 bg-rose-50 text-rose-800 line-through'
                            : isSelected
                            ? 'border-[#7950F2] bg-[#F3F0FF] text-[#0F172A] font-medium shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz_q_${q.id}`}
                          checked={isSelected}
                          onChange={() => handleSelectOption(qIdx, optIdx)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-0.5 accent-[#7950F2] shrink-0 cursor-pointer"
                        />
                        <span className="leading-snug">{opt}</span>
                      </label>
                    )
                  })}
                </div>

                {/* Question Explanation if submitted */}
                {isSubmitted && (
                  <div
                    className={`mt-2.5 pl-7 text-[12px] leading-relaxed ${
                      isCorrect ? 'text-emerald-800' : 'text-slate-600'
                    }`}
                  >
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Validation Warning Alert */}
        {validationWarning && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-amber-900 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-[12.5px] font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{validationWarning}</span>
            </div>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="text-[12px] font-bold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer text-left sm:text-right"
            >
              Submit Incomplete Test Anyway
            </button>
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-3 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-[12.5px]"
          >
            {isSubmitted ? 'Close' : 'Cancel'}
          </Button>

          <div className="flex items-center gap-2 justify-end flex-wrap">
            {isSubmitted && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-[12.5px]"
              >
                {isPassed && scorePercentage < 100 ? 'Retake for 100%' : 'Try Again'}
              </Button>
            )}

            {isPassed ? (
              hasNextLesson && onNextLesson ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleProceedNext}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="text-[12.5px] font-semibold shadow-sm"
                >
                  Proceed to Next Lesson
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  className="text-[12.5px] font-semibold"
                >
                  Done
                </Button>
              )
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSubmit(false)}
                disabled={isSaving}
                className="text-[12.5px] font-semibold shadow-sm"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                {isSaving ? 'Recording Score...' : 'Submit Test & View Score'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
