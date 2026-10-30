import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { PageHeader } from '../components/ui/FeedbackStates'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { FormField, Input, Textarea } from '../components/ui/FormField'
import {
  User,
  Mail,
  Building,
  GraduationCap,
  ShieldCheck,
  LogOut,
  Save,
  CheckCircle2,
} from 'lucide-react'

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
)

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, logout, isDemo } = useAuth()
  const { showToast } = useApp()

  // Form State initialized from authenticated user
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [university, setUniversity] = useState(user?.university || '')
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || '')
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '')
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '')
  const [isSaved, setIsSaved] = useState(false)
  const [errors, setErrors] = useState<{ fullName?: string; university?: string; graduationYear?: string }>({})

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { fullName?: string; university?: string; graduationYear?: string } = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    }
    if (!university.trim()) {
      newErrors.university = 'University or College name is required'
    }
    if (!graduationYear.trim()) {
      newErrors.graduationYear = 'Graduation Year is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    updateUserProfile({
      fullName: fullName.trim(),
      bio: bio.trim(),
      university: university.trim(),
      graduationYear: graduationYear.trim(),
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
    })

    setIsSaved(true)
    showToast('Profile Saved', 'Your student profile information has been successfully updated.', 'success')
    setTimeout(() => setIsSaved(false), 3000)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Profile & Settings"
        subtitle="Manage your Google identity, verified student credentials, and public developer links."
        badge={<StatusBadge variant="primary">{user.role}</StatusBadge>}
      />

      {/* Main Profile Header Banner */}
      <Card padding="lg" className="border-[#EDF0F6]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Profile Avatar (80 × 80px) */}
          <div className="relative shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-[80px] h-[80px] rounded-full object-cover border-4 border-[#F3F0FF] shadow-xs"
            />
            <span
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#20C997] border-2 border-white"
              title="Active Now"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-bold text-[#25324B]">{user.fullName}</h2>
                <p className="text-[13px] text-[#64748B] flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <StatusBadge variant="info" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  {isDemo ? 'Demo Session' : 'Google Verified'}
                </StatusBadge>
              </div>
            </div>

            <p className="text-[14px] text-[#64748B] mt-3 leading-[22px] max-w-2xl">{user.bio}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-[12px] text-[#8993A7]">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#7950F2]" /> {user.university}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#7950F2]" /> Class of {user.graduationYear}
              </span>
              <span>• Joined {user.joinedDate}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Two Column Layout: Edit Form vs Security & Account */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Editable Information Form (2 cols) */}
        <div className="lg:col-span-2">
          <Card padding="md">
            <CardHeader className="pb-4">
              <CardTitle>Edit Profile Information</CardTitle>
              <p className="text-[12px] text-[#64748B]">
                Update your contact details, education history, and portfolio presence.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name" required error={errors.fullName}>
                    <Input
                      icon={<User className="w-4 h-4" />}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      hasError={Boolean(errors.fullName)}
                    />
                  </FormField>

                  <FormField label="Google Account Email" hint="Synced via Google OAuth">
                    <Input
                      icon={<Mail className="w-4 h-4" />}
                      value={user.email}
                      disabled
                      className="opacity-75 cursor-not-allowed bg-[#EDF0F6]/40"
                    />
                  </FormField>
                </div>

                <FormField label="About & Bio" hint="Max 250 characters">
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="University / College" required error={errors.university}>
                    <Input
                      icon={<Building className="w-4 h-4" />}
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      hasError={Boolean(errors.university)}
                    />
                  </FormField>

                  <FormField label="Expected Graduation Year" required error={errors.graduationYear}>
                    <Input
                      icon={<GraduationCap className="w-4 h-4" />}
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      hasError={Boolean(errors.graduationYear)}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="GitHub Profile URL">
                    <Input
                      icon={<GithubIcon className="w-4 h-4" />}
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </FormField>

                  <FormField label="LinkedIn Profile URL">
                    <Input
                      icon={<LinkedinIcon className="w-4 h-4" />}
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </FormField>
                </div>

                <div className="pt-3 border-t border-[#EDF0F6] flex items-center justify-between">
                  {isSaved ? (
                    <span className="text-[13px] text-[#20C997] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
                    </span>
                  ) : (
                    <span className="text-[12px] text-[#8993A7]">
                      Updates immediately reflect in your navigation header.
                    </span>
                  )}
                  <Button type="submit" variant="primary" size="sm" icon={<Save className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Account Management & Session Controls (1 col) */}
        <div className="space-y-4">
          <Card padding="md">
            <CardHeader className="pb-3">
              <CardTitle>Session & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-[8px] bg-[#F5F7FC] border border-[#EDF0F6] text-[12px] text-[#64748B]">
                <p className="font-semibold text-[#25324B] mb-1">Authenticated Account</p>
                <p className="truncate">{user.email}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[#20C997] font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PKCE OAuth 2.0 Token Active</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => logout()}
                  icon={<LogOut className="w-4 h-4" />}
                >
                  Sign Out of InternHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
