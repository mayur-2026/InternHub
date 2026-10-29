import React from 'react'
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
  Code2,
} from 'lucide-react'

export const ProgressPage: React.FC = () => {
  const {
    course,
    projects,
    curriculumProgressPercentage,
    overallProgressPercentage,
    completedTopicsCount,
    totalTopicsCount,
    approvedProjectsCount,
  } = useApp()

  const skillsList = [
    { name: 'React 19 & Component Architecture', level: 95, category: 'Frontend' },
    { name: 'Strict TypeScript & Polymorphism', level: 90, category: 'Language' },
    { name: 'Tailwind CSS v4 & Design Tokens', level: 96, category: 'UI/UX' },
    { name: 'React Router v7 & Caching Store', level: 88, category: 'Architecture' },
    { name: 'Supabase PostgreSQL & Security RLS', level: 75, category: 'Database' },
    { name: 'Automated CI/CD & Vercel Edge', level: 70, category: 'DevOps' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress & Growth Analytics"
        subtitle="Holistic performance metrics, curriculum milestones, and verified engineering competencies."
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
          <p className="text-[12px] text-[#64748B] mt-0.5">1 approved, 1 under review</p>
          <div className="mt-3">
            <ProgressBar value={Math.round((approvedProjectsCount / projects.length) * 100)} variant="project" />
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
            14 Days
          </p>
          <p className="text-[12px] text-[#64748B] mt-0.5">Top 10% cohort consistency</p>
          <div className="mt-3">
            <ProgressBar value={85} variant="warning" />
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Module Progression vs Technical Competencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Completion Breakdown */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Module Completion Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.modules.map((mod) => {
              const modTotal = mod.topics.length
              const modDone = mod.topics.filter((t) => t.isCompleted).length
              const pct = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0

              return (
                <div key={mod.id} className="p-3 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold text-[#25324B] truncate max-w-[70%]">
                      Week {mod.weekNumber}: {mod.title}
                    </span>
                    <span className="text-[12px] font-bold text-[#7950F2]">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} variant={pct === 100 ? 'success' : 'primary'} />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-[#8993A7]">
                    <span>{modDone} of {modTotal} topics verified</span>
                    <span>{pct === 100 ? 'Mastered' : 'In Progress'}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Technical Competencies Matrix */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Verified Engineering Competencies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[13px] text-[#64748B] leading-[20px]">
              Competencies are systematically validated through mentor pull-request reviews, rubric evaluations, and code submissions.
            </p>

            <div className="space-y-3 pt-1">
              {skillsList.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[#25324B] flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#7950F2]" />
                      {skill.name}
                    </span>
                    <span className="font-bold text-[#25324B]">{skill.level}%</span>
                  </div>
                  <ProgressBar
                    value={skill.level}
                    variant={skill.level >= 90 ? 'success' : skill.level >= 75 ? 'primary' : 'warning'}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Submission History Ledger */}
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
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-[#F8FAFF] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-[#25324B]">
                      {proj.title}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        variant={
                          proj.status === 'Approved'
                            ? 'success'
                            : proj.status === 'Under Review'
                            ? 'warning'
                            : 'project'
                        }
                      >
                        {proj.status}
                      </StatusBadge>
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">
                      {proj.submission?.submittedAt || 'Pending Submission'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#25324B]">
                      {proj.submission?.grade ? (
                        <span className="text-[#20C997] flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#20C997]" />
                          {proj.submission.grade}/100
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
