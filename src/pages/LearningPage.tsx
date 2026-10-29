import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Topic } from '../types'
import { PageHeader } from '../components/ui/FeedbackStates'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/FormField'
import {
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  Code,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react'

export const LearningPage: React.FC = () => {
  const { course, curriculumProgressPercentage, completedTopicsCount, totalTopicsCount, toggleTopic } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress'>('all')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  // Filter modules and topics based on search & filter
  const filteredModules = course.modules
    .map((mod) => {
      const filteredTopics = mod.topics.filter((top) => {
        const matchesSearch =
          top.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          top.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
          filterStatus === 'all'
            ? true
            : filterStatus === 'completed'
            ? top.isCompleted
            : !top.isCompleted

        return matchesSearch && matchesFilter
      })
      return { ...mod, topics: filteredTopics }
    })
    .filter((mod) => mod.topics.length > 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Curriculum"
        subtitle="Step-by-step technical modules, interactive topic tracking, and reference documentation."
        badge={
          <StatusBadge variant="primary">
            {completedTopicsCount} / {totalTopicsCount} Topics Done
          </StatusBadge>
        }
      />

      {/* Progress Summary Card */}
      <Card padding="md" className="hero-gradient border-[#7950F2]/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#25324B]">Overall Curriculum Completion</h3>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Checking off topics dynamically recalculates your module percentages and internship score.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[26px] font-bold text-[#7950F2] leading-none">
              {curriculumProgressPercentage}%
            </span>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={curriculumProgressPercentage} variant="primary" />
        </div>
      </Card>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search lessons, concepts, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[12px] font-medium text-[#8993A7] flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer select-none ${
              filterStatus === 'all'
                ? 'bg-[#7950F2] text-white'
                : 'bg-[#F5F7FC] text-[#64748B] hover:bg-[#EDF0F6]'
            }`}
          >
            All Topics
          </button>
          <button
            onClick={() => setFilterStatus('in-progress')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer select-none ${
              filterStatus === 'in-progress'
                ? 'bg-[#7950F2] text-white'
                : 'bg-[#F5F7FC] text-[#64748B] hover:bg-[#EDF0F6]'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer select-none ${
              filterStatus === 'completed'
                ? 'bg-[#7950F2] text-white'
                : 'bg-[#F5F7FC] text-[#64748B] hover:bg-[#EDF0F6]'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {filteredModules.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <BookOpen className="w-10 h-10 text-[#8993A7] mx-auto mb-3" />
            <h4 className="text-[16px] font-semibold text-[#25324B]">No matching topics found</h4>
            <p className="text-[13px] text-[#64748B] mt-1">
              Try adjusting your search keywords or switching your status filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setFilterStatus('all')
              }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          filteredModules.map((module) => {
            const modTotal = module.topics.length
            const modDone = module.topics.filter((t) => t.isCompleted).length
            const modPercent = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0

            return (
              <Card key={module.id} padding="none" className="overflow-hidden">
                {/* Module Header */}
                <div className="p-4 sm:p-5 border-b border-[#EDF0F6] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[6px] bg-[#F3F0FF] text-[#7950F2] text-[11px] font-bold">
                        Week {module.weekNumber}
                      </span>
                      <h3 className="text-[16px] font-bold text-[#25324B] truncate">
                        {module.title}
                      </h3>
                    </div>
                    <p className="text-[13px] text-[#64748B] mt-1 leading-[18px]">
                      {module.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[12px] font-semibold text-[#25324B]">
                        {modDone}/{modTotal} Done
                      </span>
                      <span className="text-[11px] text-[#8993A7] block">
                        {modPercent}% Complete
                      </span>
                    </div>
                    <div className="w-20">
                      <ProgressBar value={modPercent} variant="primary" />
                    </div>
                  </div>
                </div>

                {/* Topics in Module */}
                <div className="divide-y divide-[#EDF0F6]">
                  {module.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-3.5 sm:p-4 hover:bg-[#F8FAFF] transition-colors flex items-center justify-between gap-3 group"
                    >
                      {/* Topic Checkbox & Title */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleTopic(topic.id)}
                          className={`w-5 h-5 rounded-[6px] border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer focus-ring ${
                            topic.isCompleted
                              ? 'bg-[#20C997] border-[#20C997] text-white'
                              : 'border-[#EDF0F6] bg-white group-hover:border-[#7950F2]'
                          }`}
                          aria-label={topic.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {topic.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[14px] font-medium leading-[20px] transition-colors ${
                              topic.isCompleted
                                ? 'text-[#64748B] line-through'
                                : 'text-[#25324B]'
                            }`}
                          >
                            {topic.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[12px] text-[#8993A7]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {topic.durationMinutes} minutes
                            </span>
                            {topic.codeSnippet && (
                              <span className="flex items-center gap-1 text-[#7950F2]">
                                <Code className="w-3 h-3" /> Includes Code Sample
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Topic Action Trigger */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTopic(topic)}
                          className="text-[13px] text-[#7950F2] hover:text-[#6741D9]"
                        >
                          Study Lesson <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Topic Lesson Viewer Modal */}
      {selectedTopic && (
        <Modal
          isOpen={Boolean(selectedTopic)}
          onClose={() => setSelectedTopic(null)}
          title={selectedTopic.title}
          description={`Estimated Time: ${selectedTopic.durationMinutes} mins • Status: ${
            selectedTopic.isCompleted ? 'Completed' : 'In Progress'
          }`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Topic Overview */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#25324B] mb-1.5">Overview</h4>
              <p className="text-[14px] text-[#64748B] leading-[22px]">{selectedTopic.description}</p>
            </div>

            {/* Key Takeaways */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#25324B] mb-2">Key Learning Objectives</h4>
              <ul className="space-y-1.5">
                {selectedTopic.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-2 text-[13px] text-[#64748B] leading-[20px]">
                    <CheckCircle2 className="w-4 h-4 text-[#20C997] shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippet if present */}
            {selectedTopic.codeSnippet && (
              <div>
                <h4 className="text-[14px] font-semibold text-[#25324B] mb-2 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-[#7950F2]" /> Technical Implementation
                </h4>
                <div className="p-4 rounded-[8px] bg-[#25324B] text-slate-100 font-mono text-[12px] leading-[18px] overflow-x-auto">
                  <pre>{selectedTopic.codeSnippet}</pre>
                </div>
              </div>
            )}

            {/* Resource link */}
            {selectedTopic.resourceLink && (
              <div className="pt-2">
                <a
                  href={selectedTopic.resourceLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7950F2] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Official Technical Reference
                </a>
              </div>
            )}

            {/* Footer Completion Toggle */}
            <div className="pt-4 border-t border-[#EDF0F6] flex items-center justify-between">
              <span className="text-[12px] text-[#8993A7]">
                Progress updates immediately across all dashboard widgets.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedTopic.isCompleted ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => {
                    toggleTopic(selectedTopic.id)
                    setSelectedTopic((prev) => (prev ? { ...prev, isCompleted: !prev.isCompleted } : null))
                  }}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {selectedTopic.isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
