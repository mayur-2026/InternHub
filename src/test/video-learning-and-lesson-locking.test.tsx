import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import { LearningPage } from '../pages/LearningPage'
import { TOPIC_QUIZZES, getLessonQuiz } from '../data/lessonQuizzes'
import { LessonQuizModal } from '../components/learning/LessonQuizModal'

describe('Video Learning Player & Sequential Lesson Locking', () => {
  const renderLearningPage = (initialUrl = '/learning') => {
    return render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <AuthProvider>
          <AppProvider>
            <LearningPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )
  }

  it('redirects to the video class page after clicking on Start Learning from the course catalog', async () => {
    renderLearningPage('/learning')

    // Find the course cards
    const startLearningButtons = screen.getAllByRole('button', {
      name: /start learning|continue learning|review course/i,
    })
    expect(startLearningButtons.length).toBeGreaterThan(0)

    // Click on a course
    fireEvent.click(startLearningButtons[0])

    // Should redirect to the video class page
    expect(screen.getByText(/lessons in this class/i)).toBeDefined()
    expect(screen.getByText(/back to all courses/i)).toBeDefined()
  })

  it('renders the video player with real video controls and active lesson', () => {
    // In mod_4, no lessons are completed by default
    renderLearningPage('/learning?course=mod_4')

    // Lessons in This Class header
    expect(screen.getByText(/lessons in this class/i)).toBeDefined()

    // Video player play button exists
    const playButtons = screen.getAllByRole('button', { name: /play video/i })
    expect(playButtons.length).toBeGreaterThan(0)

    // First lesson is active (highlighted with lesson number)
    expect(screen.getByText(/lesson 1 of/i)).toBeDefined()
  })

  it('locks subsequent lessons so student cannot skip ahead without completing preceding lessons', () => {
    // In mod_4: Topic 1 (Interactive Project Submission), Topic 2 (Code Review Standards)
    // Neither is completed initially
    renderLearningPage('/learning?course=mod_4')

    // Lesson 2 should be locked
    const lockedBadges = screen.getAllByLabelText(/locked lesson/i)
    expect(lockedBadges.length).toBeGreaterThan(0)

    // Clicking on locked lesson 2 triggers the warning alert and prevents activation
    const lockedLessonRow = screen.getByText(/2\. code review standards & rubric evaluations/i).closest('div')
    expect(lockedLessonRow).toBeDefined()
    fireEvent.click(lockedLessonRow!)

    // Warning notification appears
    expect(screen.getByText(/lesson 2 is locked/i)).toBeDefined()
    expect(screen.getByText(/must complete lesson 1 first/i)).toBeDefined()
  })

  it('unlocks the second lesson immediately after student completes the first lesson', async () => {
    renderLearningPage('/learning?course=mod_4')

    // Initially lesson 2 is locked
    expect(screen.getAllByLabelText(/locked lesson/i).length).toBeGreaterThan(0)

    // Complete the first lesson using the "Mark as Complete" action
    const markCompleteBtn = screen.getByRole('button', { name: /mark complete/i })
    fireEvent.click(markCompleteBtn)

    // Wait for progress update and lesson 2 to unlock
    await waitFor(() => {
      // The locked badge for lesson 2 should disappear
      expect(screen.queryByLabelText(/locked lesson/i)).toBeNull()
      // Lesson 2 is now unlocked and ready for learning
      const continueBtns = screen.getAllByRole('button', { name: /continue learning/i })
      expect(continueBtns.length).toBeGreaterThan(0)
    })
  })

  it('provides an overview dropdown for locked lessons to preview curriculum objectives and prerequisites', () => {
    renderLearningPage('/learning?course=mod_4')

    // Find the Overview dropdown button on the locked lesson
    const overviewButton = screen.getAllByRole('button', { name: /overview/i })[1]
    expect(overviewButton).toBeDefined()
    expect(overviewButton.getAttribute('aria-expanded')).toBe('false')

    // Click to expand overview dropdown
    fireEvent.click(overviewButton)

    // Dropdown contents should now be visible
    expect(overviewButton.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText(/lesson summary/i)).toBeDefined()
    expect(screen.getByText(/curriculum topics & objectives/i)).toBeDefined()
    expect(screen.getByText(/lesson locked/i)).toBeDefined()

    // Click again to collapse
    fireEvent.click(overviewButton)
    expect(overviewButton.getAttribute('aria-expanded')).toBe('false')
  })

  it('guarantees at least 5 comprehensive questions for every lesson test', () => {
    // Verify each authored topic quiz has >= 5 questions
    Object.entries(TOPIC_QUIZZES).forEach(([topicId, questions]) => {
      expect(questions.length, `Topic ${topicId} must have at least 5 questions`).toBeGreaterThanOrEqual(5)
      questions.forEach((q) => {
        expect(q.question.length).toBeGreaterThan(10)
        expect(q.options.length).toBe(4)
        expect(q.explanation.length).toBeGreaterThan(10)
      })
    })

    // Verify dynamic fallback also guarantees at least 5 questions
    const mockTopic = {
      id: 'custom_mock_topic',
      moduleId: 'mod_1',
      title: 'Custom Dynamic Topic',
      durationMinutes: 30,
      isCompleted: false,
      description: 'Custom topic for test verification.',
      keyTakeaways: ['Practice 1', 'Practice 2'],
    }
    const dynamicQuiz = getLessonQuiz(mockTopic)
    expect(dynamicQuiz.length).toBeGreaterThanOrEqual(5)
  })
  it('calculates, grades, and displays knowledge check test scores with 80% passing threshold', async () => {
    const mockTopic = {
      id: 'top_1_1',
      moduleId: 'mod_1',
      title: 'React 19 Hooks',
      durationMinutes: 45,
      isCompleted: false,
      description: 'Test description',
      keyTakeaways: ['Takeaway 1'],
    }

    let recordedScore = 0
    render(
      <LessonQuizModal
        isOpen={true}
        onClose={() => {}}
        topic={mockTopic}
        courseNumber={1}
        lessonNumber={1}
        onPassed={(_id, score) => {
          recordedScore = score
        }}
      />
    )

    expect(screen.getByText(/test instructions/i)).toBeDefined()
    expect(screen.getByText(/score 80% or higher/i)).toBeDefined()

    const questions = getLessonQuiz(mockTopic)
    questions.forEach((q) => {
      const correctOptText = q.options[q.correctIndex]
      const optionLabel = screen.getByText(correctOptText)
      fireEvent.click(optionLabel)
    })

    const submitBtn = screen.getByRole('button', { name: /submit test & view score/i })
    fireEvent.click(submitBtn)

    expect(screen.getByText('100%')).toBeDefined()
    expect(screen.getByText(/perfect score/i)).toBeDefined()
    expect(screen.getByText(/5 of 5 correct/i)).toBeDefined()
    expect(recordedScore).toBe(100)
  })

  it('keeps submit test button clickable at all times and provides interactive validation when questions are incomplete', () => {
    const mockTopic = {
      id: 'top_1_1',
      moduleId: 'mod_1',
      title: 'React 19 Hooks',
      durationMinutes: 45,
      isCompleted: false,
      description: 'Test description',
      keyTakeaways: ['Takeaway 1'],
    }

    render(
      <LessonQuizModal
        isOpen={true}
        onClose={() => {}}
        topic={mockTopic}
        courseNumber={1}
        lessonNumber={1}
        onPassed={() => {}}
      />
    )

    const submitBtn = screen.getByRole('button', { name: /submit test & view score/i })
    // Button must never be hard-disabled preventing clicks
    expect(submitBtn.hasAttribute('disabled')).toBe(false)

    // Clicking when no answers are selected triggers helpful validation
    fireEvent.click(submitBtn)

    expect(screen.getByText(/please answer question 1 before submitting/i)).toBeDefined()
    expect(screen.getAllByText(/answer required/i).length).toBe(5)
    expect(screen.getByText(/submit incomplete test anyway/i)).toBeDefined()

    // Clicking "Submit Incomplete Test Anyway" proceeds without blocking the user
    fireEvent.click(screen.getByText(/submit incomplete test anyway/i))
    expect(screen.getByText('0%')).toBeDefined()
    expect(screen.getByText(/needs retake/i)).toBeDefined()
  })
  it('requires student to watch video before unlocking the test, preventing test access beforehand', () => {
    // In mod_4, topic 1 is active but unwatched
    renderLearningPage('/learning?course=mod_4')

    // Test button should initially be disabled / require watching video
    const testBtn = screen.getByRole('button', { name: /watch video to unlock test/i })
    expect(testBtn).toBeDefined()
    expect(testBtn.hasAttribute('disabled')).toBe(true)

    // Notice text informs student
    expect(screen.getByText(/watch video to unlock knowledge test/i)).toBeDefined()
  })
})
