import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import { SupportPage } from '../pages/SupportPage'

describe('CRITICAL REGRESSION: Support Ticket Form Continuous Typing & Focus Preservation', () => {
  it('allows clicking the Description field once and typing continuously without losing focus', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <SupportPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    // Open the support ticket modal
    const openBtn = screen.getByRole('button', { name: /open support ticket/i })
    await user.click(openBtn)

    // Verify modal is open
    expect(screen.getByRole('dialog')).toBeDefined()

    // Find the description textarea
    const descriptionTextarea = screen.getByPlaceholderText(
      /provide exact details, steps to reproduce/i
    ) as HTMLTextAreaElement

    // Click to focus once
    descriptionTextarea.focus()
    expect(document.activeElement).toBe(descriptionTextarea)

    // Type character by character and verify focus is NEVER lost
    const testText = 'First line of detailed bug description.\nSecond line with additional info.'
    for (let i = 0; i < testText.length; i++) {
      fireEvent.change(descriptionTextarea, {
        target: { value: testText.slice(0, i + 1) },
      })
      // CRITICAL ASSERTION: Focus must remain on the textarea on every single character
      expect(document.activeElement).toBe(descriptionTextarea)
    }

    // Verify full content is retained
    expect(descriptionTextarea.value).toBe(testText)
  })

  it('validates required fields, prevents empty submission, and successfully creates a ticket', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <SupportPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    // Open modal
    await user.click(screen.getByRole('button', { name: /open support ticket/i }))

    // Try submitting with empty fields
    const submitBtn = screen.getByRole('button', { name: /submit ticket/i })
    await user.click(submitBtn)

    // Should show error alert
    expect(
      screen.getByText(/please enter a ticket subject and a detailed description/i)
    ).toBeDefined()

    // Enter subject
    const subjectInput = screen.getByPlaceholderText(/e\.g\. aws credentials expired/i)
    fireEvent.change(subjectInput, { target: { value: 'Database timeout in local test' } })

    // Enter description
    const descTextarea = screen.getByPlaceholderText(/provide exact details/i)
    fireEvent.change(descTextarea, {
      target: { value: 'Connection pool exhausted after multiple concurrent queries.' },
    })

    // Submit valid ticket
    await user.click(submitBtn)

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    // Newly created ticket should appear in the ticket inquiries list
    expect(screen.getByText('Database timeout in local test')).toBeDefined()
    expect(
      screen.getByText(/connection pool exhausted after multiple concurrent queries/i)
    ).toBeDefined()
  })
})

