import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthForm from '@/components/auth/auth-form'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      social: vi.fn(),
      email: vi.fn()
    },
    signUp: {
      email: vi.fn()
    }
  }
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn()
  }))
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sign in form properly', () => {
    render(<AuthForm type="sign-in" />)
    expect(screen.getByText('👋 Welcome back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument()
  })

  it('renders sign up form properly', () => {
    render(<AuthForm type="sign-up" />)
    expect(screen.getByText('Create an account')).toBeInTheDocument()
  })

  it('triggers Google sign in', async () => {
    render(<AuthForm type="sign-in" />)
    fireEvent.click(screen.getByRole('button', { name: /Google/i }))
    expect(authClient.signIn.social).toHaveBeenCalledWith(expect.objectContaining({ provider: 'google' }))
  })

  it('handles sign in correctly', async () => {
    const mockRouter = { push: vi.fn(), refresh: vi.fn() }
    vi.mocked(useRouter).mockReturnValue(mockRouter as ReturnType<typeof useRouter>)
    vi.mocked(authClient.signIn.email).mockResolvedValueOnce({ error: null } as Awaited<ReturnType<typeof authClient.signIn.email>>)

    render(<AuthForm type="sign-in" />)
    
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } })
    
    const form = screen.getByRole('button', { name: /Sign In/i })
    fireEvent.click(form)

    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      }))
      expect(toast.success).toHaveBeenCalledWith('Signed in successfully!')
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
      expect(mockRouter.refresh).toHaveBeenCalled()
    })
  })

  it('handles sign up correctly', async () => {
    const mockRouter = { push: vi.fn(), refresh: vi.fn() }
    vi.mocked(useRouter).mockReturnValue(mockRouter as ReturnType<typeof useRouter>)
    vi.mocked(authClient.signUp.email).mockResolvedValueOnce({ error: null } as Awaited<ReturnType<typeof authClient.signUp.email>>)

    render(<AuthForm type="sign-up" />)
    
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), { target: { value: 'testuser@example.com' } })
    const passwordInputs = screen.getAllByPlaceholderText(/password/i).filter(el => el.getAttribute('type') === 'password')
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } })
    
    const form = screen.getByRole('button', { name: /Create Account/i })
    fireEvent.click(form)

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(expect.objectContaining({
        name: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      }))
      expect(toast.success).toHaveBeenCalledWith('Account created! Please check your email to verify.')
      expect(mockRouter.push).toHaveBeenCalledWith('/sign-in')
    })
  })

  it('handles sign in error', async () => {
    vi.mocked(authClient.signIn.email).mockResolvedValueOnce({ error: { message: 'Invalid credentials' } } as Awaited<ReturnType<typeof authClient.signIn.email>>)

    render(<AuthForm type="sign-in" />)
    
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } })
    
    const form = screen.getByRole('button', { name: /Sign In/i })
    fireEvent.click(form)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials')
    })
  })
})
