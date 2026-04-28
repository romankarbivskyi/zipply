import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { deleteAccount } from '@/actions/user'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn()
    }
  }
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      delete: vi.fn()
    }
  }
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Map())
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

const mockGetSession = auth.api.getSession as Mock

describe('deleteAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to /login if no active session', async () => {
    mockGetSession.mockResolvedValue(null)
    
    await deleteAccount()
    expect(redirect).toHaveBeenCalledWith('/login')
    expect(prisma.user.delete).not.toHaveBeenCalled()
  })

  it('deletes user and redirects to / if authenticated', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'usr_123' } })
    
    await deleteAccount()
    
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'usr_123' } })
    expect(redirect).toHaveBeenCalledWith('/')
  })
})
