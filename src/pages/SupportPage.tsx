import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { TicketCategory, TicketPriority } from '../types'
import { PageHeader } from '../components/ui/FeedbackStates'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { FormField, Input, Textarea, Select } from '../components/ui/FormField'
import {
  HelpCircle,
  PlusCircle,
  Search,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Send,
  LifeBuoy,
} from 'lucide-react'

export const SupportPage: React.FC = () => {
  const { tickets, faqs, createTicket, showToast } = useApp()
  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [faqSearch, setFaqSearch] = useState('')
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(faqs[0]?.id || null)

  // Ticket Form State
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState<TicketCategory>('Technical Issue')
  const [priority, setPriority] = useState<TicketPriority>('Medium')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenTicketModal = () => {
    setFormError(null)
    setTicketModalOpen(true)
  }

  const handleCloseTicketModal = () => {
    setFormError(null)
    setTicketModalOpen(false)
  }

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) {
      setFormError('Please enter a ticket subject and a detailed description.')
      return
    }

    setIsSubmitting(true)
    createTicket({
      subject: subject.trim(),
      category,
      priority,
      description: description.trim(),
    })

    setSubject('')
    setDescription('')
    setCategory('Technical Issue')
    setPriority('Medium')
    setFormError(null)
    setIsSubmitting(false)
    setTicketModalOpen(false)
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.category.toLowerCase().includes(faqSearch.toLowerCase())
  )

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'Urgent':
        return <StatusBadge variant="error">Urgent</StatusBadge>
      case 'High':
        return <StatusBadge variant="warning">High</StatusBadge>
      case 'Medium':
        return <StatusBadge variant="info">Medium</StatusBadge>
      default:
        return <StatusBadge variant="primary">Low</StatusBadge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <StatusBadge variant="success">Resolved</StatusBadge>
      case 'In Progress':
        return <StatusBadge variant="warning">In Progress</StatusBadge>
      default:
        return <StatusBadge variant="info">Open</StatusBadge>
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Assistance Desk"
        subtitle="Submit technical support tickets, find answers in our knowledge base, and escalate blockers."
        badge={
          <StatusBadge variant="info" icon={<LifeBuoy className="w-3.5 h-3.5" />}>
            {tickets.filter((t) => t.status !== 'Resolved').length} Active Tickets
          </StatusBadge>
        }
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenTicketModal}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Open Support Ticket
          </Button>
        }
      />

      {/* Two-Column Layout: Tickets List vs FAQ & Escalation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Tickets Desk (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#25324B]">Your Support Inquiries</h3>
            <span className="text-[12px] text-[#64748B]">Average response: &lt; 4 hours</span>
          </div>

          {tickets.length === 0 ? (
            <Card padding="lg" className="text-center py-12">
              <LifeBuoy className="w-10 h-10 text-[#8993A7] mx-auto mb-3" />
              <h4 className="text-[16px] font-semibold text-[#25324B]">No tickets raised</h4>
              <p className="text-[13px] text-[#64748B] mt-1">
                Everything looks smooth! If you need help with environments or curriculum, click below.
              </p>
              <Button
                size="sm"
                className="mt-4"
                onClick={handleOpenTicketModal}
                icon={<PlusCircle className="w-4 h-4" />}
              >
                Create a Ticket
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <Card key={ticket.id} padding="md" className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#EDF0F6]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded-[6px] bg-[#F3F0FF] text-[#7950F2]">
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-[12px] text-[#64748B] font-medium">• {ticket.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[14px] font-semibold text-[#25324B]">{ticket.subject}</h4>
                    <p className="text-[13px] text-[#64748B] mt-1 leading-[20px]">{ticket.description}</p>
                  </div>

                  {ticket.lastReply && (
                    <div className="p-3 bg-[#F5F7FC] rounded-[8px] border border-[#EDF0F6] flex items-start gap-2.5 text-[12px] text-[#64748B]">
                      <MessageSquare className="w-4 h-4 text-[#7950F2] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#25324B]">Latest Response: </span>
                        <span>{ticket.lastReply}</span>
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-[#8993A7] flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" /> Created {ticket.createdAt}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: FAQ Accordion & Quick Escalation (1 col) */}
        <div className="space-y-6">
          {/* Quick Contact & Escalation */}
          <Card padding="md" className="hero-gradient border-[#7950F2]/15">
            <h4 className="text-[14px] font-bold text-[#25324B] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#7950F2]" /> Need Urgent Help?
            </h4>
            <p className="text-[12px] text-[#64748B] mt-1.5 leading-[18px]">
              For urgent deployment roadblocks or deadline questions, reach out directly in the Discord fellows channel or book mentor hours.
            </p>
            <div className="mt-3.5 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center bg-white text-[12px]"
                onClick={() => showToast('Discord Workspace', 'Fellowship Discord community link opening...', 'info')}
              >
                Join Fellowship Discord
              </Button>
            </div>
          </Card>

          {/* Searchable FAQ Accordion */}
          <Card padding="md">
            <CardHeader className="pb-3">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <div className="pt-2">
                <Input
                  icon={<Search className="w-4 h-4" />}
                  placeholder="Search FAQ topics..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {filteredFaqs.length === 0 ? (
                <p className="text-[12px] text-[#8993A7] py-4 text-center">
                  No matching answers found.
                </p>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id
                  return (
                    <div
                      key={faq.id}
                      className="border border-[#EDF0F6] rounded-[8px] overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        aria-expanded={isExpanded}
                        type="button"
                        className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-[#F8FAFF] transition-colors cursor-pointer select-none"
                      >
                        <span className="text-[13px] font-semibold text-[#25324B] leading-[18px]">
                          {faq.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#7950F2] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#8993A7] shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="p-3 bg-[#F8FAFF] border-t border-[#EDF0F6] text-[12px] text-[#64748B] leading-[18px]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Raise Ticket Modal */}
      <Modal
        isOpen={ticketModalOpen}
        onClose={handleCloseTicketModal}
        title="Open Support Ticket"
        description="Describe your inquiry or blocker so our engineering mentors and support team can assist you."
        maxWidth="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          {formError && (
            <div className="p-3 bg-[#FEF2F2] border border-[#fecaca] rounded-[8px] text-[12px] text-[#DC2626] flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <FormField label="Subject" required>
            <Input
              placeholder="e.g. AWS credentials expired, Project deliverable doubt..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSubmitting}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Category" required>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                disabled={isSubmitting}
              >
                <option value="Technical Issue">Technical Issue</option>
                <option value="Curriculum Doubt">Curriculum Doubt</option>
                <option value="Deadline Extension">Deadline Extension</option>
                <option value="General Inquiry">General Inquiry</option>
              </Select>
            </FormField>

            <FormField label="Priority" required>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                disabled={isSubmitting}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Detailed Description" required>
            <Textarea
              placeholder="Provide exact details, steps to reproduce, or specific links to help us resolve this promptly..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </FormField>

          <div className="pt-3 border-t border-[#EDF0F6] flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCloseTicketModal}
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
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
