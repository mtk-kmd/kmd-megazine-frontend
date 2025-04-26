import { Organization } from '@/hooks/types'
import NextAuth, { User, type DefaultSession } from 'next-auth'

export type AuthPayload = {
  token: string
  is_authenticated: boolean
  data: {
    user_id: number
    user_name: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    role_id: number
    auth_id: num | null
    status: boolean
    createdAt: string
    updatedAt: string
    auth: string | null
  }
}

declare module 'next-auth' {
  interface Session {
    user: AuthPayload
    is_authenticated: boolean
  }
  interface User extends AuthPayload {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: AuthPayload
    is_authenticated: boolean
  }
}
