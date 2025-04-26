
export type AuthPayload = {
  is_authenticated: boolean
  token: string
  data: {
    user_id: number
    user_name: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    role_id: number
    auth_id: number | null
    status: boolean
    createdAt: string
    updatedAt: string
    auth: string | null
  }
}

declare module 'next-auth' {
  interface Session {
    is_authenticated: boolean
    user: AuthPayload
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: AuthPayload
    is_authenticated: boolean
  }
}
