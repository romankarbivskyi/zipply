import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CopyButton } from '@/components/copy-button'

describe('CopyButton', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    })
    vi.useFakeTimers()
  })

  it('renders copy icon initially', () => {
    render(<CopyButton text="https://test.com" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByTitle('Copy short URL')).toBeInTheDocument()
  })

  it('copies text and shows check icon temporarily on click', async () => {
    render(<CopyButton text="https://test.com" />)
    const btn = screen.getByRole('button')

    fireEvent.click(btn)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://test.com')

    act(() => {
      vi.advanceTimersByTime(2000)
    })
  })
})
