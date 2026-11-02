import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { PageHeader } from '../components/ui/FeedbackStates'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  Award,
  CheckCircle2,
  Flame,
  Star,
  Target,
} from 'lucide-react'

export const ProgressPage: React.FC = () => {
  const { isDemo } = useAuth()
  const {
    course,
    projects,
    curriculumProgressPercentage,
    overallProgressPercentage,
    completedTopicsCount,
    totalTopicsCount,
    approvedProjectsCount,
    learningStreak,
  } = useApp()

  const underReviewCount = projects.filter((project) => project.status === 'Under Review').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress & Growth Analytics"
        subtitle="Holistic performance metrics, curriculum milestones, and project evaluation ledger."
        badge={<StatusBadge variant="primary">{overallProgressPercentage}% Overall Mastery</StatusBadge>}
      />

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="hero-gradient border-[#7950F2]/20">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#7950F2]">
              Overall Fellowship
            </span>
            <Award className="w-5 h-5 text-[#7950F2]" />
          </div>
          <p className="text-[28px] font-bold text-[#25324B] mt-2 tracking-tight">
            {overallProgressPercentage}%
          </p>
          <p className="text-[12px] text-[#64748B] mt-0.5">Weighted curriculum + projects</p>
          <div className="mt-3">
            <ProgressBar value={overallProgressPercentage} variant="primary" />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#8993A7]">
              Curriculum Topics
            </span>
            <CheckCircle2 className="w-5 h-5 text-[#20C997]" />
          </div>
          <p className="text-[28px] font-bold text-[#25324B] mt-2 tracking-tight">
            {curriculumProgressPercentage}%
          </p>
          <p className="text-[12px] text-[#64748B] mt-0.5">{completedTopicsCount} of {totalTopicsCount} topics done</p>
          <div className="mt-3">
            <ProgressBar value={curriculumProgressPercentage} variant="success" />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#8993A7]">
              Sprint Deliverables
            </span>
            <Target className="w-5 h-5 text-[#F06595]" />
          </div>
          <p className="text-[28px] font-bold text-[#25324B] mt-2 tracking-tight">
            {approvedProjectsCount} / {projects.length}
          </p>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            {approvedProjectsCount} approved, {underReviewCount} under review
          </p>
          <div className="mt-3">
            <ProgressBar
              value={projects.length > 0 ? Math.round((approvedProjectsCount / projects.length) * 100) : 0}
              variant="project"
            />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#8993A7]">
              Active Streak
            </span>
            <Flame className="w-5 h-5 text-[#FFB347]" />
          </div>
          <p className="text-[28px] font-bold text-[#25324B] mt-2 tracking-tight">
            {isDemo ? '14 Days' : `${learningStreak} ${learningStreak === 1 ? 'Day' : 'Days'}`}
          </p>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            {isDemo ? 'Top 10% cohort consistency' : learningStreak === 0 ? 'Complete lessons to build streak' : 'Active study consistency'}
          </p>
          <div className="mt-3">
            <ProgressBar
              value={isDemo ? 85 : Math.min(100, Math.round((completedTopicsCount / (totalTopicsCount || 1)) * 100))}
              variant="warning"
            />
          </div>
        </Card>
      </div>

      {/* Module Progression Breakdown */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>Module Completion Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.modules.map((moduleItem) => {
            const totalLessons = moduleItem.topics.length
            const completedLessons = moduleItem.topics.filter((topic) => topic.isCompleted).length
            const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

            return (
              <div key={moduleItem.id} className="p-3 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-semibold text-[#25324B] truncate max-w-[70%]">
                    Course {moduleItem.weekNumber}: {moduleItem.title}
                  </span>
                  <span className="text-[12px] font-bold text-[#7950F2]">{percentage}%</span>
                </div>
                <ProgressBar value={percentage} variant={percentage === 100 ? 'success' : 'primary'} />
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#8993A7]">
                  <span>{completedLessons} of {totalLessons} topics verified</span>
                  <span>{percentage === 100 ? 'Mastered' : 'In Progress'}</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Evaluated Deliverables Ledger */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>Evaluated Deliverable Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#EDF0F6] text-[#8993A7] text-[12px] font-semibold uppercase">
                  <th className="pb-3 pr-4">Project</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Submission Date</th>
                  <th className="pb-3 px-4">Rubric Score</th>
                  <th className="pb-3 pl-4">Reviewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF0F6]">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#F8FAFF] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-[#25324B]">
                      {project.title}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        variant={
                          project.status === 'Approved'
                            ? 'success'
                            : project.status === 'Under Review'
                            ? 'warning'
                            : 'project'
                        }
                      >
                        {project.status}
                      </StatusBadge>
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">
                      {project.submission?.submittedAt || 'Pending Submission'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#25324B]">
                      {project.submission?.grade ? (
                        <span className="text-[#20C997] flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#20C997]" />
                          {project.submission.grade}/100
                        </span>
                      ) : (
                        <span className="text-[#8993A7] font-normal">—</span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-[#64748B]">
                      Dr. Sarah Lin
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
