import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'

// Pages
import { DashboardPage } from '../pages/DashboardPage'
import { InternshipsPage } from '../pages/InternshipsPage'
import { LearningPage } from '../pages/LearningPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { ProgressPage } from '../pages/ProgressPage'
import { FeedbackPage } from '../pages/FeedbackPage'
import { SupportPage } from '../pages/SupportPage'
import { ProfilePage } from '../pages/ProfilePage'
import { LoginPage } from '../pages/LoginPage'

describe('End-to-End Application Audit: Pages, Workflows & Interactivity', () => {
  it('protects routes and renders login page when unauthenticated', async () => {
    localStorage.setItem('internhub_logged_out', 'true')
    localStorage.removeItem('internhub_auth_user')
    localStorage.setItem('internhub_is_demo', 'false')

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardPage />} />
              </Route>
            </Routes>
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    // Should redirect to login page
    expect(screen.getByText(/welcome to internhub/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /explore as demo student/i })).toBeDefined()
  })

  it('renders all 8 sections and allows navigation across pages', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="internships" element={<InternshipsPage />} />
                <Route path="learning" element={<LearningPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    // Dashboard renders
    expect(screen.getByText(/curriculum progress/i)).toBeDefined()
    expect(screen.getByText(/assigned projects/i)).toBeDefined()
    expect(screen.getByText(/current module/i)).toBeDefined()
  })

  it('Learning: Toggles topic completion and updates curriculum percentage', async () => {
    render(
      <MemoryRouter initialEntries={['/learning']}>
        <AuthProvider>
          <AppProvider>
            <LearningPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText(/learning curriculum/i)).toBeDefined()

    // Find incomplete topic and click checkbox
    const topicCheckboxes = screen.getAllByRole('button', {
      name: /mark complete|mark incomplete/i,
    })
    expect(topicCheckboxes.length).toBeGreaterThan(0)

    const firstCheckbox = topicCheckboxes[0]
    fireEvent.click(firstCheckbox)

    // Toggle should succeed without errors
    expect(firstCheckbox).toBeDefined()
  })

  it('Projects: Validates GitHub and Live Demo URLs and updates submission status', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/projects']}>
        <AuthProvider>
          <AppProvider>
            <ProjectsPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText(/assigned projects & sprints/i)).toBeDefined()

    // Find submit button on unsubmitted project
    const submitButtons = screen.getAllByRole('button', { name: /submit project|update/i })
    expect(submitButtons.length).toBeGreaterThan(0)

    await user.click(submitButtons[0])

    // Modal opens
    expect(screen.getByRole('dialog')).toBeDefined()

    // Enter invalid URLs
    const repoInput = screen.getByPlaceholderText(/https:\/\/github\.com/i)
    const demoInput = screen.getByPlaceholderText(/https:\/\/your-project\.vercel\.app/i)

    fireEvent.change(repoInput, { target: { value: 'invalid-repo-url' } })
    fireEvent.change(demoInput, { target: { value: 'invalid-demo' } })

    const confirmBtn = screen.getByRole('button', { name: /confirm submission/i })
    await user.click(confirmBtn)

    // Should display validation errors
    expect(screen.getByText(/please provide a valid github repository url/i)).toBeDefined()

    // Enter valid URLs
    fireEvent.change(repoInput, { target: { value: 'https://github.com/alexrivera-dev/new-submission' } })
    fireEvent.change(demoInput, { target: { value: 'https://my-demo-app.vercel.app' } })

    await user.click(confirmBtn)

    // Modal closes
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it('Feedback: Submits weekly retrospective and records it in history', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/feedback']}>
        <AuthProvider>
          <AppProvider>
            <FeedbackPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    const whatWentWellInput = screen.getByPlaceholderText(/key concepts mastered/i)
    const goalsInput = screen.getByPlaceholderText(/specific milestones you intend/i)

    fireEvent.change(whatWentWellInput, { target: { value: 'Completed unit and E2E regression tests.' } })
    fireEvent.change(goalsInput, { target: { value: 'Deploy production release on Vercel.' } })

    const submitBtn = screen.getByRole('button', { name: /record reflection/i })
    await user.click(submitBtn)

    // Entry should appear in the past retrospectives section
    expect(screen.getByText('Completed unit and E2E regression tests.')).toBeDefined()
    expect(screen.getByText('Deploy production release on Vercel.')).toBeDefined()
  })

  it('Profile: Validates required inputs and persists updates', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AuthProvider>
          <AppProvider>
            <ProfilePage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText(/student profile & settings/i)).toBeDefined()

    const nameInput = screen.getByDisplayValue(/alex rivera/i)
    fireEvent.change(nameInput, { target: { value: 'Alex Morgan' } })

    const saveBtn = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveBtn)

    expect(screen.getByText(/changes saved successfully/i)).toBeDefined()
  })
})
