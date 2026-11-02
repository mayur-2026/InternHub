import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import { LearningPage } from '../pages/LearningPage'

describe('Learning Section Redesign — Modern Course Cards & Catalog', () => {
  const renderLearningPage = () => {
    return render(
      <MemoryRouter initialEntries={['/learning']}>
        <AuthProvider>
          <AppProvider>
            <LearningPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )
  }

  it('renders the modern course catalog with square-style course cards', () => {
    renderLearningPage()

    // Title and Header
    expect(screen.getByText(/learning curriculum & courses/i)).toBeDefined()
    expect(screen.getByText(/course catalog/i)).toBeDefined()

    // Check that all 5 course modules are rendered in the catalog
    expect(screen.getAllByText(/modern frontend architecture & react 19/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/navigation, client routing & caching architecture/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/cloud backend, postgresql & row-level security/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/full-stack project delivery & submissions/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/production testing, performance & vercel ci\/cd/i).length).toBeGreaterThan(0)
  })

  it('displays essential course information on every card without fabricated or e-commerce elements', () => {
    renderLearningPage()

    // Category and difficulty badges
    expect(screen.getAllByText(/^frontend$/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/intermediate/i).length).toBeGreaterThan(0)

    // Lesson counts from real data
    expect(screen.getAllByText(/3 lessons/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/2 lessons/i).length).toBeGreaterThan(0)

    // Action buttons
    const continueButtons = screen.getAllByRole('button', {
      name: /continue learning|view course|review course/i,
    })
    expect(continueButtons.length).toBeGreaterThanOrEqual(5)

    // STRICT: Verify no pricing, no discounts, no shopping carts, no dummy ratings
    expect(screen.queryByText(/[$€₹]|price|discount|cart|buy now|add to cart/i)).toBeNull()
    expect(screen.queryByText(/4\.[0-9] ★|5\.0 ★/)).toBeNull()
  })

  it('filters courses by search keywords and category filter pills', () => {
    renderLearningPage()

    // Search input
    const searchInput = screen.getByPlaceholderText(/search courses, lessons, topics/i)
    fireEvent.change(searchInput, { target: { value: 'PostgreSQL' } })

    // Course matching PostgreSQL should remain visible
    expect(screen.getAllByText(/cloud backend, postgresql & row-level security/i).length).toBeGreaterThan(0)

    // Non-matching courses should be filtered out
    expect(screen.queryByText(/production testing, performance & vercel ci\/cd/i)).toBeNull()

    // Reset search
    fireEvent.change(searchInput, { target: { value: '' } })
    expect(screen.getAllByText(/production testing, performance & vercel ci\/cd/i).length).toBeGreaterThan(0)

    // Filter by category
    const frontendPill = screen.getByRole('button', { name: /^frontend$/i })
    fireEvent.click(frontendPill)

    expect(screen.getAllByText(/modern frontend architecture & react 19/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/cloud backend, postgresql & row-level security/i)).toBeNull()
  })

  it('allows clicking an action button to select a course and view its interactive topics', () => {
    renderLearningPage()

    const continueButtons = screen.getAllByRole('button', {
      name: /continue learning|view course|review course/i,
    })
    expect(continueButtons.length).toBeGreaterThan(0)

    // Click on the first course's action button
    fireEvent.click(continueButtons[0])

    // Topic checkboxes must be accessible
    const checkboxes = screen.getAllByRole('button', {
      name: /mark complete|mark incomplete/i,
    })
    expect(checkboxes.length).toBeGreaterThan(0)
  })
})
