import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { PageHeader } from '../components/ui/FeedbackStates'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Modal } from '../components/ui/Modal'
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  Video,
  Mail,
  Award,
  ExternalLink,
  ShieldCheck,
  Building2,
} from 'lucide-react'

export const InternshipsPage: React.FC = () => {
  const { internship, course, curriculumProgressPercentage, overallProgressPercentage, showToast } = useApp()
  const { user } = useAuth()
  const [certModalOpen, setCertModalOpen] = useState(false)

  const isEligibleForCert = overallProgressPercentage >= 100

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Internships"
        subtitle="Active engineering fellowship, mentor supervision details, and credential status."
        badge={<StatusBadge variant="success">Active Enrollment</StatusBadge>}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCertModalOpen(true)}
            icon={<Award className="w-4 h-4 text-[#7950F2]" />}
          >
            {isEligibleForCert ? 'Claim Certificate' : 'Preview Certificate'}
          </Button>
        }
      />

      {/* Main Internship Details Card */}
      <Card padding="lg" className="border-[#EDF0F6]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#EDF0F6]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-[12px] bg-[#F3F0FF] text-[#7950F2] flex items-center justify-center shrink-0 border border-[#7950F2]/15">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#25324B]">
                  {internship.title}
                </h2>
                <StatusBadge variant="primary">{internship.cohort}</StatusBadge>
              </div>
              <p className="text-[14px] text-[#64748B] mt-1 flex items-center gap-1.5 font-medium">
                <span>{internship.company}</span>
                <span>•</span>
                <span className="text-[#7950F2] font-semibold">{internship.role}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Status: {internship.status}
            </StatusBadge>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-5 border-b border-[#EDF0F6]">
          <div className="p-3 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
            <span className="text-[11px] font-semibold text-[#8993A7] uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Tenure
            </span>
            <p className="text-[13px] font-semibold text-[#25324B] mt-1">{internship.startDate} – {internship.endDate}</p>
          </div>

          <div className="p-3 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
            <span className="text-[11px] font-semibold text-[#8993A7] uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Commitment
            </span>
            <p className="text-[13px] font-semibold text-[#25324B] mt-1">{internship.hoursPerWeek} Hours / Week</p>
          </div>

          <div className="p-3 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
            <span className="text-[11px] font-semibold text-[#8993A7] uppercase flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Compensation
            </span>
            <p className="text-[13px] font-semibold text-[#25324B] mt-1">{internship.stipend}</p>
          </div>

          <div className="p-3 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
            <span className="text-[11px] font-semibold text-[#8993A7] uppercase flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Progress
            </span>
            <p className="text-[13px] font-semibold text-[#7950F2] mt-1">{overallProgressPercentage}% Overall</p>
          </div>
        </div>

        {/* Description & Scope */}
        <div className="pt-5">
          <h4 className="text-[14px] font-semibold text-[#25324B] mb-2">Program Scope & Objectives</h4>
          <p className="text-[14px] text-[#64748B] leading-[22px]">{internship.description}</p>
        </div>
      </Card>

      {/* Mentor and Roadmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentor Card */}
        <Card padding="md" className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Assigned Supervisor & Mentor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={internship.mentor.avatar}
                alt={internship.mentor.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#EDF0F6]"
              />
              <div className="min-w-0">
                <h4 className="text-[15px] font-bold text-[#25324B] truncate">{internship.mentor.name}</h4>
                <p className="text-[12px] text-[#64748B]">{internship.mentor.title}</p>
                <p className="text-[12px] text-[#7950F2] flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" /> {internship.mentor.email}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6] text-[12px] text-[#64748B]">
              <p className="font-semibold text-[#25324B] mb-1">Office Hours Schedule</p>
              <p>{internship.mentor.officeHours}</p>
            </div>

            <a
              href={internship.mentor.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                icon={<Video className="w-4 h-4" />}
              >
                Join Mentor Office Hours
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Milestone Roadmap */}
        <Card padding="md" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Internship Milestone Roadmap</CardTitle>
            <span className="text-[12px] font-semibold text-[#64748B]">
              Curriculum: {curriculumProgressPercentage}%
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={curriculumProgressPercentage} variant="primary" />

            <div className="space-y-3 pt-2">
              {course.modules.map((mod) => {
                const totalTopics = mod.topics.length
                const completedTopics = mod.topics.filter((topic) => topic.isCompleted).length
                const isComplete = totalTopics > 0 && completedTopics === totalTopics
                const activeWeekNum = course.modules.find((m) => m.topics.some((topic) => !topic.isCompleted))?.weekNumber || 1
                const isActive = !isComplete && mod.weekNumber === activeWeekNum

                return (
                  <div
                    key={mod.id}
                    className={`flex items-start gap-3 p-3 rounded-[8px] border transition-colors ${
                      isComplete
                        ? 'bg-[#E6FCF5] border-[#bbf7d0]/40'
                        : isActive
                        ? 'bg-[#F3F0FF] border-[#7950F2]/20'
                        : 'bg-[#F5F7FC] border-[#EDF0F6]'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-[#20C997] shrink-0 mt-0.5" />
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                          isActive
                            ? 'border-[#7950F2] text-[#7950F2]'
                            : 'border-[#8993A7] text-[#8993A7]'
                        }`}
                      >
                        {mod.weekNumber}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-[14px] font-semibold ${
                            isActive ? 'text-[#25324B]' : isComplete ? 'text-[#25324B]' : 'text-[#64748B]'
                          }`}
                        >
                          Phase {mod.weekNumber}: {mod.title}
                        </p>
                        {isComplete ? (
                          <StatusBadge variant="success">Completed</StatusBadge>
                        ) : isActive ? (
                          <StatusBadge variant="primary">Current Active</StatusBadge>
                        ) : (
                          <span className="text-[11px] text-[#8993A7]">Upcoming</span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#64748B] mt-0.5">
                        {mod.description} • {completedTopics}/{totalTopics} Topics Completed
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificate Modal */}
      <Modal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title="Fellowship Certificate of Completion"
        description="Official credential awarded upon 100% completion of internship curriculum and project deliverables."
        maxWidth="lg"
      >
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-[12px] border-4 border-double border-[#7950F2]/40 bg-white text-center relative overflow-hidden shadow-inner">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F3F0FF] text-[#7950F2] flex items-center justify-center mb-4">
              <Award className="w-8 h-8" />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-widest text-[#7950F2]">
              CloudScale Technologies Fellowship
            </p>
            <h2 className="text-[24px] sm:text-[28px] font-bold text-[#25324B] mt-2">
              Certificate of Completion
            </h2>
            <p className="text-[13px] text-[#64748B] mt-1">This is officially presented to</p>

            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#7950F2] mt-2 border-b border-[#EDF0F6] pb-2 max-w-sm mx-auto">
              {user?.fullName || 'Alex Rivera'}
            </h3>

            <p className="text-[13px] text-[#64748B] max-w-md mx-auto mt-3 leading-[20px]">
              for successfully fulfilling all coursework, technical milestones, and engineering deliverables in the{' '}
              <span className="font-semibold text-[#25324B]">{internship.title}</span>.
            </p>

            <div className="mt-8 pt-4 border-t border-[#EDF0F6] flex items-center justify-between text-left text-[11px] text-[#8993A7]">
              <div>
                <p className="font-semibold text-[#25324B]">{internship.mentor.name}</p>
                <p>Lead Supervising Architect</p>
              </div>
              <div className="flex items-center gap-1.5 text-[#20C997] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Credential</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#25324B]">Issued: {internship.endDate}</p>
                <p>Credential ID: IH-2026-ALPHA-982</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-[13px] text-[#64748B]">
              Current Program Progress: <span className="font-bold text-[#7950F2]">{overallProgressPercentage}%</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCertModalOpen(false)}>
                Close
              </Button>
              <Button
                size="sm"
                icon={<ExternalLink className="w-4 h-4" />}
                onClick={() => showToast('Credential Link Copied', 'Certificate credential link has been copied to your clipboard!', 'info')}
              >
                Share to LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
