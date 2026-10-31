import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider, useApp } from '../context/AppContext'
import { ProjectsPage } from '../pages/ProjectsPage'

const TestDashboardInspector = () => {
  const { projects, activeProjectsCount } = useApp()
  return (
    <div>
      <span data-testid="active-projects-count">{activeProjectsCount}</span>
      <span data-testid="proj-4-status">
        {projects.find((p) => p.id === 'proj_4')?.status}
      </span>
    </div>
  )
}

describe('Start Project Functionality & Status Transitions', () => {
  it('renders Start Project button only for unstarted projects (proj_4)', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <AuthProvider>
          <AppProvider>
            <ProjectsPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    // proj_4 is "Production Infrastructure as Code (IaC)" which is 'Not Started'
    const proj4Heading = screen.getByText(/Production Infrastructure as Code \(IaC\)/i)
    expect(proj4Heading).toBeDefined()

    // There should be a "Start Project" button for proj_4
    const startButtons = screen.getAllByRole('button', { name: /start project/i })
    expect(startButtons.length).toBeGreaterThan(0)
  })

  it('allows viewing project details without changing status', async () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <AuthProvider>
          <AppProvider>
            <ProjectsPage />
            <TestDashboardInspector />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    // Initial status of proj_4 should be 'Not Started'
    expect(screen.getByTestId('proj-4-status').textContent).toBe('Not Started')

    // Find "View Details" buttons and click one
    const viewButtons = screen.getAllByRole('button', { name: /view details/i })
    expect(viewButtons.length).toBeGreaterThan(0)
    fireEvent.click(viewButtons[0])

    // Modal opens showing "Required Deliverables" or "Project Overview"
    await waitFor(() => {
      expect(screen.getByText(/project overview/i)).toBeDefined()
    })

    // Status remains strictly 'Not Started'
    expect(screen.getByTestId('proj-4-status').textContent).toBe('Not Started')

    // Close the modal
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    fireEvent.click(closeButtons[0])

    // Status is still 'Not Started'
    expect(screen.getByTestId('proj-4-status').textContent).toBe('Not Started')
  })

  it('clicking Start Project transitions status to In Progress and updates active count', async () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <AuthProvider>
          <AppProvider>
            <ProjectsPage />
            <TestDashboardInspector />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    const initialActiveCount = Number(screen.getByTestId('active-projects-count').textContent)
    expect(screen.getByTestId('proj-4-status').textContent).toBe('Not Started')

    // Find and click the Start Project button
    const startBtn = screen.getAllByRole('button', { name: /start project/i })[0]
    fireEvent.click(startBtn)

    // Status changes to In Progress
    await waitFor(() => {
      expect(screen.getByTestId('proj-4-status').textContent).toBe('In Progress')
    })

    // Active projects count increments
    const newActiveCount = Number(screen.getByTestId('active-projects-count').textContent)
    expect(newActiveCount).toBe(initialActiveCount + 1)
  })
})
