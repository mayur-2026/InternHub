import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Project, ProjectStatus } from '../types'
import { PageHeader } from '../components/ui/FeedbackStates'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { FormField, Input, Textarea } from '../components/ui/FormField'
import {
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  Star,
  Layers,
  Send,
  Play,
  FolderOpen,
} from 'lucide-react'
import { EmptyState } from '../components/ui/FeedbackStates'

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

export const ProjectsPage: React.FC = () => {
  const { projects, startProject, submitProject, activeProjectsCount, approvedProjectsCount } = useApp()
  const [filter, setFilter] = useState<string>('all')
  const [activeProjectToSubmit, setActiveProjectToSubmit] = useState<Project | null>(null)
  const [activeProjectToView, setActiveProjectToView] = useState<Project | null>(null)
  const [activeProjectOverview, setActiveProjectOverview] = useState<Project | null>(null)
  const [startingProjectId, setStartingProjectId] = useState<string | null>(null)

  // Submission Form State
  const [repoUrl, setRepoUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [formErrors, setFormErrors] = useState<{ repo?: string; demo?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStartProject = async (projectId: string) => {
    if (startingProjectId) return
    setStartingProjectId(projectId)
    try {
      const success = await startProject(projectId)
      if (success && activeProjectOverview?.id === projectId) {
        setActiveProjectOverview(null)
      }
    } finally {
      setStartingProjectId(null)
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true
    return p.status.toLowerCase().replace(' ', '-') === filter
  })

  const handleOpenSubmitModal = (project: Project) => {
    setActiveProjectToSubmit(project)
    setRepoUrl(project.submission?.repoUrl || '')
    setDemoUrl(project.submission?.demoUrl || '')
    setNotes(project.submission?.notes || '')
    setFormErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { repo?: string; demo?: string } = {}

    if (!repoUrl.trim() || !repoUrl.includes('github.com')) {
      errors.repo = 'Please provide a valid GitHub repository URL (e.g. https://github.com/...)'
    }
    if (!demoUrl.trim() || !demoUrl.startsWith('http')) {
      errors.demo = 'Please provide a valid live demo URL starting with http:// or https://'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (activeProjectToSubmit) {
      setIsSubmitting(true)
      try {
        await submitProject(activeProjectToSubmit.id, {
          repoUrl: repoUrl.trim(),
          demoUrl: demoUrl.trim(),
          notes: notes.trim(),
        })
      } finally {
        setIsSubmitting(false)
        setActiveProjectToSubmit(null)
      }
    }
  }

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Approved':
        return <StatusBadge variant="success">Approved</StatusBadge>
      case 'Under Review':
        return <StatusBadge variant="warning">Under Review</StatusBadge>
      case 'In Progress':
        return <StatusBadge variant="project">In Progress</StatusBadge>
      case 'Not Started':
        return <StatusBadge variant="neutral">Not Started</StatusBadge>
      default:
        return <StatusBadge variant="info">Assigned</StatusBadge>
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Projects & Sprints"
        subtitle="Hands-on portfolio assignments, submission review pipeline, and mentor grading."
        badge={
          <StatusBadge variant="project">
            {approvedProjectsCount} Approved • {activeProjectsCount} In Flight
          </StatusBadge>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 border-b border-[#EDF0F6] pb-3">
        {[
          { label: 'All Projects', value: 'all' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Under Review', value: 'under-review' },
          { label: 'Approved', value: 'approved' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer select-none ${
              filter === tab.value
                ? 'bg-[#7950F2] text-white shadow-xs'
                : 'bg-[#F5F7FC] text-[#64748B] hover:bg-[#EDF0F6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects in this category"
          description="There are currently no assigned projects matching this filter criteria."
          icon={<FolderOpen className="w-6 h-6" strokeWidth={1.75} />}
          actionLabel="View All Projects"
          onAction={() => setFilter('all')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} padding="md" className="flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-[6px] ${
                      project.difficulty === 'Advanced'
                        ? 'bg-[#FFF0F6] text-[#C2255C]'
                        : project.difficulty === 'Intermediate'
                        ? 'bg-[#F3F0FF] text-[#7950F2]'
                        : 'bg-[#E6FCF5] text-[#087F5B]'
                    }`}
                  >
                    {project.difficulty}
                  </span>
                  <span className="text-[12px] text-[#8993A7] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{project.estimatedHours} hrs
                  </span>
                </div>
                {getStatusBadge(project.status)}
              </div>

              {/* Title & Description */}
              <h3 className="text-[16px] font-bold text-[#25324B] leading-[22px]">
                {project.title}
              </h3>
              <p className="text-[13px] text-[#64748B] mt-1.5 leading-[20px]">
                {project.description}
              </p>

              {/* Tech Stack Tags */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[#F5F7FC] text-[#64748B] border border-[#EDF0F6]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Deliverables */}
              <div className="mt-4 pt-3 border-t border-[#EDF0F6]">
                <p className="text-[12px] font-semibold text-[#8993A7] uppercase mb-1.5">
                  Key Deliverables
                </p>
                <ul className="space-y-1">
                  {project.deliverables.map((item, idx) => (
                    <li key={idx} className="text-[12px] text-[#64748B] flex items-start gap-1.5 leading-[16px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#20C997] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="mt-5 pt-3 border-t border-[#EDF0F6] flex items-center justify-between">
              <span className="text-[12px] text-[#8993A7] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Due {project.dueDate}
              </span>

              {project.submission ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveProjectToView(project)}
                  >
                    Submission Details
                  </Button>
                  {project.status !== 'Approved' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenSubmitModal(project)}
                    >
                      Update
                    </Button>
                  )}
                </div>
              ) : project.status === 'In Progress' ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveProjectOverview(project)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenSubmitModal(project)}
                    icon={<Send className="w-3.5 h-3.5" />}
                  >
                    Submit Project
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveProjectOverview(project)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStartProject(project.id)}
                    isLoading={startingProjectId === project.id}
                    disabled={startingProjectId !== null}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                  >
                    Start Project
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Interactive Submission Form Modal */}
      {activeProjectToSubmit && (
        <Modal
          isOpen={Boolean(activeProjectToSubmit)}
          onClose={() => setActiveProjectToSubmit(null)}
          title={`Submit: ${activeProjectToSubmit.title}`}
          description="Enter your public GitHub repository URL, live deployed link, and technical reflections."
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="GitHub Repository URL"
              required
              hint="Must be public"
              error={formErrors.repo}
            >
              <Input
                icon={<GithubIcon className="w-4 h-4" />}
                placeholder="https://github.com/username/repository-name"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                hasError={Boolean(formErrors.repo)}
              />
            </FormField>

            <FormField
              label="Live Working Demo URL"
              required
              hint="Vercel, Netlify, or Cloud host"
              error={formErrors.demo}
            >
              <Input
                icon={<ExternalLink className="w-4 h-4" />}
                placeholder="https://your-project.vercel.app"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                hasError={Boolean(formErrors.demo)}
              />
            </FormField>

            <FormField
              label="Technical Reflection & Architecture Notes"
              hint="Challenges faced, design decisions, and solutions"
            >
              <Textarea
                placeholder="Describe your implementation architecture, key design choices, and how you solved any roadblocks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </FormField>

            <div className="p-3 bg-[#F3F0FF] rounded-[8px] text-[12px] text-[#7950F2] flex items-start gap-2">
              <Layers className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Once submitted, your project status will transition to <strong>Under Review</strong> and mentor Dr. Sarah Lin will receive your submission for evaluation.
              </span>
            </div>

            <div className="pt-3 border-t border-[#EDF0F6] flex justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveProjectToSubmit(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={<Send className="w-3.5 h-3.5" />}
                isLoading={isSubmitting}
              >
                Confirm Submission
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Submission Review / Details Modal */}
      {activeProjectToView && activeProjectToView.submission && (
        <Modal
          isOpen={Boolean(activeProjectToView)}
          onClose={() => setActiveProjectToView(null)}
          title={`Deliverable Review: ${activeProjectToView.title}`}
          description={`Submitted at ${activeProjectToView.submission.submittedAt}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
              <div>
                <p className="text-[12px] text-[#8993A7]">Current Status</p>
                <div className="mt-1">{getStatusBadge(activeProjectToView.status)}</div>
              </div>
              {activeProjectToView.submission.grade && (
                <div className="text-right">
                  <p className="text-[12px] text-[#8993A7]">Grade Awarded</p>
                  <p className="text-[20px] font-bold text-[#20C997]">
                    {activeProjectToView.submission.grade} / 100
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-[12px] font-semibold text-[#8993A7] uppercase">Repository Link</p>
              <a
                href={activeProjectToView.submission.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[13px] text-[#7950F2] hover:underline break-all"
              >
                <GithubIcon className="w-4 h-4 shrink-0" />
                {activeProjectToView.submission.repoUrl}
              </a>
            </div>

            <div className="space-y-2">
              <p className="text-[12px] font-semibold text-[#8993A7] uppercase">Live Demo Link</p>
              <a
                href={activeProjectToView.submission.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[13px] text-[#7950F2] hover:underline break-all"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                {activeProjectToView.submission.demoUrl}
              </a>
            </div>

            {activeProjectToView.submission.notes && (
              <div className="space-y-1 pt-1">
                <p className="text-[12px] font-semibold text-[#8993A7] uppercase">Student Notes</p>
                <div className="p-3 bg-[#F8FAFF] rounded-[8px] text-[13px] text-[#64748B] border border-[#EDF0F6] leading-[20px]">
                  {activeProjectToView.submission.notes}
                </div>
              </div>
            )}

            {activeProjectToView.submission.mentorFeedback && (
              <div className="space-y-1.5 pt-2 border-t border-[#EDF0F6]">
                <p className="text-[12px] font-semibold text-[#20C997] uppercase flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" /> Mentor Feedback
                </p>
                <div className="p-3.5 bg-[#E6FCF5] rounded-[8px] text-[13px] text-[#087F5B] border border-[#bbf7d0]/40 leading-[20px]">
                  {activeProjectToView.submission.mentorFeedback}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#EDF0F6] flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setActiveProjectToView(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Project Overview Modal (Inspect details without starting/submitting) */}
      {activeProjectOverview && (
        <Modal
          isOpen={true}
          onClose={() => setActiveProjectOverview(null)}
          title={activeProjectOverview.title}
          description={`Estimated ~${activeProjectOverview.estimatedHours} hours • Due ${activeProjectOverview.dueDate}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6]">
              <div>
                <p className="text-[12px] text-[#8993A7]">Current Status</p>
                <div className="mt-1">{getStatusBadge(activeProjectOverview.status)}</div>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-[#8993A7]">Difficulty</p>
                <p className="text-[13px] font-bold text-[#25324B] mt-1">
                  {activeProjectOverview.difficulty}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-[#8993A7] uppercase tracking-wider mb-1">
                Project Overview
              </p>
              <p className="text-[14px] text-[#25324B] leading-[22px]">
                {activeProjectOverview.description}
              </p>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-[#8993A7] uppercase tracking-wider mb-2">
                Tech Stack & Tools
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeProjectOverview.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-[6px] bg-[#F5F7FC] border border-[#EDF0F6] text-[12px] font-medium text-[#25324B]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-[#8993A7] uppercase tracking-wider mb-2">
                Required Deliverables
              </p>
              <ul className="space-y-1.5">
                {activeProjectOverview.deliverables.map((deliv, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px] text-[#64748B]">
                    <CheckCircle2 className="w-4 h-4 text-[#20C997] shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activeProjectOverview.startedAt && (
              <div className="p-3 rounded-[8px] bg-[#E7F5FF] border border-[#A5D8FF] text-[12px] text-[#1864AB] flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  Sprint started on{' '}
                  <strong>
                    {new Date(activeProjectOverview.startedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </strong>
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-[#EDF0F6] flex justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveProjectOverview(null)}
              >
                Close
              </Button>
              {activeProjectOverview.status === 'Not Started' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStartProject(activeProjectOverview.id)}
                  isLoading={startingProjectId === activeProjectOverview.id}
                  disabled={startingProjectId !== null}
                  icon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  Start Project
                </Button>
              )}
              {activeProjectOverview.status === 'In Progress' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const proj = activeProjectOverview
                    setActiveProjectOverview(null)
                    handleOpenSubmitModal(proj)
                  }}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Submit Project
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
