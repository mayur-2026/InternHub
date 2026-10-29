import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import {
  GraduationCap,
  FolderGit2,
  Flame,
  Star,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Video,
  FileCheck2,
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const {
    internship,
    course,
    projects,
    curriculumProgressPercentage,
    completedTopicsCount,
    totalTopicsCount,
    activeProjectsCount,
    averageRating,
    toggleTopic,
  } = useApp()

  // Find active module (Module 3 in our seed)
  const currentModule = course.modules[2] || course.modules[0]
  const currentModuleCompletedCount = currentModule.topics.filter((t) => t.isCompleted).length
  const currentModulePercent = Math.round(
    (currentModuleCompletedCount / currentModule.topics.length) * 100
  )

  return (
    <div className="space-y-6">
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-[12px] border border-[#7950F2]/15 hero-gradient p-5 sm:p-6 card-shadow">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[#7950F2] text-[12px] font-semibold mb-2.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20C997] animate-pulse" />
              {internship.role} • Week 4 of 12
            </div>
            <h1 className="text-[22px] md:text-[24px] font-bold text-[#25324B] leading-[30px] md:leading-[32px] tracking-tight">
              Welcome back, {user?.fullName.split(' ')[0] || 'Intern'}! 👋
            </h1>
            <p className="text-[14px] text-[#64748B] mt-1 leading-[22px]">
              You're making great strides in the <span className="font-semibold text-[#25324B]">{internship.title}</span>. You completed {completedTopicsCount} out of {totalTopicsCount} topics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/learning">
              <Button size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Curriculum Progress"
          value={`${curriculumProgressPercentage}%`}
          subtitle={`${completedTopicsCount} of ${totalTopicsCount} topics completed`}
          icon={<GraduationCap />}
          variant="primary"
          trend={{ value: '+12% this week', isPositive: true }}
        />
        <StatCard
          title="Assigned Projects"
          value={activeProjectsCount}
          subtitle="2 active sprints due soon"
          icon={<FolderGit2 />}
          variant="project"
          trend={{ value: '1 Approved', isPositive: true }}
        />
        <StatCard
          title="Study Consistency"
          value="14 Days"
          subtitle="24.5 total hours logged"
          icon={<Flame />}
          variant="warning"
          trend={{ value: 'Daily Streak 🔥' }}
        />
        <StatCard
          title="Mentor Evaluation"
          value={`${averageRating} / 5`}
          subtitle="Based on latest rubric reviews"
          icon={<Star />}
          variant="success"
          trend={{ value: 'Top 5% Cohort', isPositive: true }}
        />
      </div>

      {/* 3. Main Dashboard Three-Column Layout (1.6fr / 1fr / 1.1fr on ≥1280px) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1.1fr] gap-4 items-start">
        {/* COLUMN 1: Active Projects Overview */}
        <div className="space-y-4">
          <Card padding="md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Active Projects & Sprints</CardTitle>
                <p className="text-[12px] text-[#64748B] mt-0.5">Hands-on engineering deliverables</p>
              </div>
              <Link to="/projects" className="text-[13px] font-semibold text-[#7950F2] hover:text-[#6741D9] flex items-center gap-1 focus-ring rounded-md p-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="p-3.5 rounded-[10px] bg-[#F5F7FC] border border-[#EDF0F6] hover:border-[#7950F2]/30 transition-all duration-150"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-[14px] font-semibold text-[#25324B] leading-[20px]">
                        {project.title}
                      </h4>
                      <p className="text-[12px] text-[#64748B] line-clamp-1 mt-0.5">
                        {project.description}
                      </p>
                    </div>
                    <StatusBadge
                      variant={
                        project.status === 'Approved'
                          ? 'success'
                          : project.status === 'Under Review'
                          ? 'warning'
                          : project.status === 'In Progress'
                          ? 'project'
                          : 'primary'
                      }
                    >
                      {project.status}
                    </StatusBadge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EDF0F6]/80 text-[12px] text-[#8993A7]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Due {project.dueDate}
                    </span>
                    <Link
                      to="/projects"
                      className="text-[#7950F2] font-semibold hover:underline flex items-center gap-1"
                    >
                      {project.submission ? 'View Submission' : 'Submit Work'}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Learning Stats Card */}
          <Card padding="md" className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8993A7]">Curriculum Milestone</p>
                <h4 className="text-[15px] font-semibold text-[#25324B] mt-0.5">Module 3 of 5 in Progress</h4>
              </div>
              <span className="text-[14px] font-bold text-[#7950F2]">{curriculumProgressPercentage}%</span>
            </div>
            <div className="mt-3">
              <ProgressBar value={curriculumProgressPercentage} variant="primary" />
            </div>
          </Card>
        </div>

        {/* COLUMN 2: Current Learning Path & Interactive Topic Checklist */}
        <div className="space-y-4">
          <Card padding="md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Current Module</CardTitle>
                <p className="text-[12px] text-[#64748B] mt-0.5">Week {currentModule.weekNumber}: {currentModule.title}</p>
              </div>
              <span className="text-[12px] font-bold text-[#7950F2] bg-[#F3F0FF] px-2 py-0.5 rounded-full">
                {currentModulePercent}%
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="mb-2">
                <ProgressBar value={currentModulePercent} variant="primary" />
              </div>

              <div className="text-[12px] font-semibold text-[#8993A7] uppercase tracking-wider pt-1">
                Topics Checklist (Interactive)
              </div>

              <div className="space-y-2">
                {currentModule.topics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className="flex items-start gap-3 p-2.5 rounded-[8px] hover:bg-[#F5F7FC] transition-colors cursor-pointer group select-none border border-transparent hover:border-[#EDF0F6]"
                  >
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-[6px] border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        topic.isCompleted
                          ? 'bg-[#20C997] border-[#20C997] text-white'
                          : 'border-[#EDF0F6] bg-white group-hover:border-[#7950F2]'
                      }`}
                      aria-label={topic.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {topic.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[13px] leading-[18px] font-medium ${
                          topic.isCompleted
                            ? 'text-[#64748B] line-through'
                            : 'text-[#25324B]'
                        }`}
                      >
                        {topic.title}
                      </p>
                      <span className="text-[11px] text-[#8993A7]">{topic.durationMinutes} mins</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/learning" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Open Complete Curriculum
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* COLUMN 3: Mentor Card, Upcoming Deadlines & Recent Activity */}
        <div className="space-y-4 lg:col-span-2 xl:col-span-1">
          {/* Assigned Mentor Card */}
          <Card padding="md">
            <CardTitle>Assigned Mentor</CardTitle>
            <div className="mt-3 flex items-center gap-3">
              <img
                src={internship.mentor.avatar}
                alt={internship.mentor.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#EDF0F6]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-[14px] font-semibold text-[#25324B] leading-[18px] truncate">
                  {internship.mentor.name}
                </h4>
                <p className="text-[12px] text-[#64748B] truncate">{internship.mentor.title}</p>
                <p className="text-[11px] text-[#8993A7] mt-0.5">{internship.mentor.officeHours}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EDF0F6] flex gap-2">
              <a
                href={internship.mentor.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center text-[13px]"
                  icon={<Video className="w-3.5 h-3.5 text-[#7950F2]" />}
                >
                  Office Hours
                </Button>
              </a>
              <Link to="/feedback" className="flex-1">
                <Button size="sm" variant="secondary" className="w-full justify-center text-[13px]">
                  Feedback
                </Button>
              </Link>
            </div>
          </Card>

          {/* Upcoming Deadlines with Priority Pills */}
          <Card padding="md">
            <CardTitle>Upcoming Deadlines</CardTitle>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-start justify-between gap-2 p-2.5 rounded-[8px] bg-[#FFF0F6] border border-[#fbcfe8]/40">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-[#F06595] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#25324B] leading-[18px]">
                      Collaborative Task Board
                    </p>
                    <p className="text-[11px] text-[#64748B]">Project Deliverable 2</p>
                  </div>
                </div>
                <StatusBadge variant="project">Nov 04</StatusBadge>
              </div>

              <div className="flex items-start justify-between gap-2 p-2.5 rounded-[8px] bg-[#FFF4E6] border border-[#fed7aa]/40">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-[#FFB347] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#25324B] leading-[18px]">
                      Module 3 Quiz & Checkpoint
                    </p>
                    <p className="text-[11px] text-[#64748B]">PostgreSQL & RLS</p>
                  </div>
                </div>
                <StatusBadge variant="warning">In 3 Days</StatusBadge>
              </div>

              <div className="flex items-start justify-between gap-2 p-2.5 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
                <div className="flex items-start gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#7950F2] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#25324B] leading-[18px]">
                      Weekly Retrospective
                    </p>
                    <p className="text-[11px] text-[#64748B]">Sprint 4 Reflection</p>
                  </div>
                </div>
                <span className="text-[11px] text-[#8993A7] font-medium self-center">Every Friday</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
