import { UserWithOptionalFaculty } from '@/features/users/types'
import { Organization } from '@/hooks/types'
import NextAuth, { User, type DefaultSession } from 'next-auth'

export type AuthPayload = {
  token: string
  is_authenticated: boolean
  data: UserWithOptionalFaculty
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
