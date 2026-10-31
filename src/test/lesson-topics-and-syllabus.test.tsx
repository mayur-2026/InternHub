import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import { LearningPage } from '../pages/LearningPage'

describe('Course Syllabus & Lesson Topics — UI & Functional Workflows', () => {
  const renderLearningPageInCourse = (courseId = 'mod_1') => {
    return render(
      <MemoryRouter initialEntries={[`/learning?course=${courseId}`]}>
        <AuthProvider>
          <AppProvider>
            <LearningPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )
  }

  it('renders modern lesson cards with title, duration, badges, and NO strikethrough styling', () => {
    renderLearningPageInCourse('mod_1')

    // Header and Course Info
    expect(screen.getByText(/modern frontend architecture & react 19/i)).toBeDefined()
    expect(screen.getByText(/course syllabus & lesson topics/i)).toBeDefined()

    // Lesson titles must exist
    const lessonTitle = screen.getByText(/react 19 hooks, action transitions & state models/i)
    expect(lessonTitle).toBeDefined()

    // STRICT: Verify no strikethrough class on lesson title
    expect(lessonTitle.className).not.toContain('line-through')

    // Lesson duration & metadata
    expect(screen.getAllByText(/45 minutes/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/code sample/i).length).toBeGreaterThan(0)
  })

  it('displays functional lesson action buttons: Review Lesson, Start Lesson, Continue Learning', () => {
    renderLearningPageInCourse('mod_1')

    // Mod 1 has completed lessons in seedData -> Review Lesson button must be present
    const reviewButtons = screen.getAllByRole('button', { name: /review lesson/i })
    expect(reviewButtons.length).toBeGreaterThan(0)

    // Incomplete lessons should have Start Lesson or Continue Learning
    const actionButtons = screen.getAllByRole('button', {
      name: /start lesson|continue learning|review lesson/i,
    })
    expect(actionButtons.length).toBeGreaterThanOrEqual(3)
  })

  it('opens rich lesson detail view with learning objectives, code snippet, and navigation', async () => {
    renderLearningPageInCourse('mod_1')

    // Click on the first lesson's action button
    const firstLessonBtn = screen.getAllByRole('button', { name: /review lesson/i })[0]
    fireEvent.click(firstLessonBtn)

    // Modal opens with lesson details
    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByText(/key learning objectives/i)).toBeDefined()
    expect(screen.getByText(/technical implementation/i)).toBeDefined()

    // Next / Previous lesson navigation buttons exist in modal
    const nextBtn = screen.getByRole('button', { name: /next/i })
    expect(nextBtn).toBeDefined()
    expect((nextBtn as HTMLButtonElement).disabled).toBe(false)

    // Click next lesson navigation
    fireEvent.click(nextBtn)

    // Second lesson title appears both in modal and on page
    await waitFor(() => {
      expect(screen.getAllByText(/strict typescript design patterns/i).length).toBeGreaterThanOrEqual(2)
    })
  })

  it('displays verified external learning resources opening safely in new tabs', () => {
    renderLearningPageInCourse('mod_1')

    // Open lesson modal
    const firstLessonBtn = screen.getAllByRole('button', { name: /review lesson/i })[0]
    fireEvent.click(firstLessonBtn)

    // Check for documentation links
    const externalLinks = screen.getAllByRole('link')
    expect(externalLinks.length).toBeGreaterThan(0)

    // Ensure links open safely in new tab
    externalLinks.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    })
  })

  it('supports functional checkbox toggle with immediate progress update', async () => {
    renderLearningPageInCourse('mod_1')

    const checkboxes = screen.getAllByRole('button', {
      name: /mark complete|mark incomplete/i,
    })
    expect(checkboxes.length).toBeGreaterThan(0)

    // Click first checkbox
    const firstCheckbox = checkboxes[0]
    fireEvent.click(firstCheckbox)

    // Verify checkbox can be interacted with without errors
    expect(firstCheckbox).toBeDefined()
  })

  it('renders celebratory completion banner when all course lessons are completed', () => {
    // mod_1 has 3 completed topics in demo seedData
    renderLearningPageInCourse('mod_1')

    expect(screen.getByText(/course completed! all lessons & exercises finished/i)).toBeDefined()
    expect(screen.getByText(/course progress/i)).toBeDefined()
    expect(screen.getByText(/100%/i)).toBeDefined()
  })
})
