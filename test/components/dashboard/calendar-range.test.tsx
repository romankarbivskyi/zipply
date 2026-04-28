import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CalendarRange from '@/components/dashboard/calendar-range'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/dashboard',
}))

describe('CalendarRange', () => {
  it('renders trigger button', () => {
    render(<CalendarRange />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('opens popover and triggers date change when Today is clicked', () => {
    render(<CalendarRange />)
    fireEvent.click(screen.getByRole('button'))
    
    const todayButton = screen.getByText('Today')
    expect(todayButton).toBeInTheDocument()
    
    fireEvent.click(todayButton)
    expect(mockReplace).toHaveBeenCalled()
  })
})
