import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

let shouldThrow = true

const MaybeThrow = () => {
  if (shouldThrow) throw new Error('Boom')
  return <p>Recovered</p>
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    shouldThrow = false
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('shows error UI and recovers on retry', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    shouldThrow = true

    const { rerender } = render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Failed to load bills')).toBeInTheDocument()
    expect(screen.getByText('Boom')).toBeInTheDocument()

    shouldThrow = false
    await userEvent.setup().click(screen.getByRole('button', { name: 'Retry' }))

    rerender(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Recovered')).toBeInTheDocument()

    spy.mockRestore()
  })
})
