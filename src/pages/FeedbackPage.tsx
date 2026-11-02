import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { FeedbackEvaluation } from '../types'
import { PageHeader, EmptyState } from '../components/ui/FeedbackStates'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { FormField, Textarea } from '../components/ui/FormField'
import {
  Star,
  Calendar,
  Send,
  Sparkles,
  MessageSquare,
} from 'lucide-react'

function getAverageCriteria(
  evaluations: FeedbackEvaluation[],
  key: keyof FeedbackEvaluation['criteria']
): string {
  if (evaluations.length === 0) return '—'
  const total = evaluations.reduce((sum, item) => sum + item.criteria[key], 0)
  return (total / evaluations.length).toFixed(1)
}

export const FeedbackPage: React.FC = () => {
  const { feedbackList, reflections, submitWeeklyReflection, averageRating } = useApp()

  // Weekly Reflection Form State
  const [whatWentWell, setWhatWentWell] = useState('')
  const [blockers, setBlockers] = useState('')
  const [goalsForNextWeek, setGoalsForNextWeek] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReflectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!whatWentWell.trim() || !goalsForNextWeek.trim()) {
      setFormError('Please fill in what went well and your primary goals for next sprint.')
      return
    }

    setIsSubmitting(true)
    try {
      await submitWeeklyReflection({
        whatWentWell: whatWentWell.trim(),
        blockers: blockers.trim() || 'No major blockers encountered this sprint.',
        goalsForNextWeek: goalsForNextWeek.trim(),
      })

      setWhatWentWell('')
      setBlockers('')
      setGoalsForNextWeek('')
      setFormError(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasReviews = feedbackList.length > 0
  const avgCodeQuality = getAverageCriteria(feedbackList, 'codeQuality')
  const avgArchitecture = getAverageCriteria(feedbackList, 'architecture')
  const avgUiUx = getAverageCriteria(feedbackList, 'uiux')
  const avgCommunication = getAverageCriteria(feedbackList, 'communication')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mentor Feedback & Reviews"
        subtitle="Qualitative rubric assessments from your mentor and continuous weekly retrospectives."
        badge={
          <StatusBadge variant={hasReviews ? 'success' : 'info'} icon={<Star className="w-3.5 h-3.5" />}>
            {hasReviews ? `Cohort Avg: ${averageRating} / 5.0` : 'Reviews Pending'}
          </StatusBadge>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" className="hero-gradient border-[#7950F2]/15 md:col-span-1">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#7950F2]">
            Standing & Rating
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[32px] font-bold text-[#25324B]">
              {hasReviews ? averageRating : '—'}
            </span>
            <span className="text-[16px] text-[#64748B]">{hasReviews ? '/ 5.0' : 'Pending'}</span>
          </div>
          <p className="text-[12px] text-[#64748B] mt-1">
            {hasReviews
              ? `Based on ${feedbackList.length} evaluated sprint ${feedbackList.length === 1 ? 'deliverable' : 'deliverables'}`
              : 'Evaluations appear after your first deliverable review'}
          </p>
          <div className="mt-3 flex items-center gap-1 text-[#FFB347]">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <Star
                key={starIndex}
                className={`w-4 h-4 ${hasReviews && averageRating >= starIndex ? 'fill-[#FFB347]' : 'text-[#EDF0F6]'}`}
              />
            ))}
          </div>
        </Card>

        <Card padding="md" className="md:col-span-2">
          <h4 className="text-[14px] font-semibold text-[#25324B] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#7950F2]" /> Evaluation Rubric Criteria
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
              <p className="text-[11px] font-semibold text-[#8993A7] uppercase">Code Quality</p>
              <p className="text-[18px] font-bold text-[#20C997] mt-1">{avgCodeQuality} {hasReviews ? '/ 5' : ''}</p>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
              <p className="text-[11px] font-semibold text-[#8993A7] uppercase">Architecture</p>
              <p className="text-[18px] font-bold text-[#7950F2] mt-1">{avgArchitecture} {hasReviews ? '/ 5' : ''}</p>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
              <p className="text-[11px] font-semibold text-[#8993A7] uppercase">UI / UX</p>
              <p className="text-[18px] font-bold text-[#20C997] mt-1">{avgUiUx} {hasReviews ? '/ 5' : ''}</p>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
              <p className="text-[11px] font-semibold text-[#8993A7] uppercase">Communication</p>
              <p className="text-[18px] font-bold text-[#7950F2] mt-1">{avgCommunication} {hasReviews ? '/ 5' : ''}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mentor Reviews vs Weekly Retrospective Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Mentor Reviews */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-bold text-[#25324B]">Mentor Rubric Evaluations</h3>

          {!hasReviews ? (
            <EmptyState
              title="No mentor evaluations recorded yet"
              description="Your qualitative rubric evaluations, criteria scores, and mentor feedback will appear here after your first project submission is reviewed."
              icon={<MessageSquare className="w-6 h-6" strokeWidth={1.75} />}
            />
          ) : (
            feedbackList.map((item) => (
              <Card key={item.id} padding="md" className="space-y-3">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF0F6]">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.mentorAvatar}
                      alt={item.mentorName}
                      className="w-10 h-10 rounded-full object-cover border border-[#EDF0F6]"
                    />
                    <div>
                      <h4 className="text-[14px] font-bold text-[#25324B]">{item.mentorName}</h4>
                      <p className="text-[12px] text-[#64748B]">{item.mentorRole}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] font-bold text-[#20C997] bg-[#E6FCF5] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#20C997]" />
                      {item.overallRating}
                    </span>
                    <span className="text-[11px] text-[#8993A7] mt-1 block">{item.date}</span>
                  </div>
                </div>

                {item.projectName && (
                  <div className="inline-block px-2.5 py-1 rounded-[6px] bg-[#F3F0FF] text-[#7950F2] text-[12px] font-semibold">
                    Assignment: {item.projectName}
                  </div>
                )}

                <p className="text-[13px] text-[#64748B] leading-[22px] bg-[#F8FAFF] p-3.5 rounded-[8px] border border-[#EDF0F6]">
                  "{item.comments}"
                </p>
              </Card>
            ))
          )}
        </div>

        {/* Weekly Reflection Form */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-bold text-[#25324B]">Weekly Self-Reflection</h3>

          <Card padding="md">
            <CardHeader className="pb-3">
              <CardTitle>Submit Weekly Retrospective</CardTitle>
              <p className="text-[12px] text-[#64748B]">
                Reflect on your technical progress, identify blockers, and set goals for the next sprint.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReflectionSubmit} className="space-y-3.5">
                {formError && (
                  <p className="text-[12px] text-[#DC2626] bg-[#FEF2F2] p-2 rounded-md border border-[#fecaca]">
                    {formError}
                  </p>
                )}

                <FormField label="What went well this week?" required>
                  <Textarea
                    placeholder="Key concepts mastered, PRs merged, achievements..."
                    value={whatWentWell}
                    onChange={(e) => setWhatWentWell(e.target.value)}
                    rows={2}
                  />
                </FormField>

                <FormField label="Any blockers or challenges encountered?">
                  <Textarea
                    placeholder="Technical roadblocks, tooling issues, or questions for your mentor..."
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    rows={2}
                  />
                </FormField>

                <FormField label="Core goals for next sprint?" required>
                  <Textarea
                    placeholder="Specific milestones you intend to deliver next week..."
                    value={goalsForNextWeek}
                    onChange={(e) => setGoalsForNextWeek(e.target.value)}
                    rows={2}
                  />
                </FormField>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={<Send className="w-3.5 h-3.5" />}
                    isLoading={isSubmitting}
                  >
                    Record Reflection
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Past Reflections List */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-semibold text-[#25324B]">Past Retrospectives</h4>

            {reflections.length === 0 ? (
              <EmptyState
                title="No retrospectives recorded yet"
                description="Use the form above to record your first weekly retrospective on what went well, blockers, and next goals."
                icon={<Sparkles className="w-6 h-6" strokeWidth={1.75} />}
              />
            ) : (
              reflections.map((reflection) => (
                <Card key={reflection.id} padding="md" className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EDF0F6]">
                    <span className="text-[13px] font-bold text-[#7950F2]">Week {reflection.weekNumber} Retrospective</span>
                    <span className="text-[12px] text-[#8993A7] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {reflection.date}
                    </span>
                  </div>
                  <div className="space-y-1 text-[13px]">
                    <p className="text-[#25324B] font-semibold">Highlights:</p>
                    <p className="text-[#64748B] text-[12px]">{reflection.whatWentWell}</p>
                  </div>
                  <div className="space-y-1 text-[13px] pt-1">
                    <p className="text-[#25324B] font-semibold">Next Goals:</p>
                    <p className="text-[#64748B] text-[12px]">{reflection.goalsForNextWeek}</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
