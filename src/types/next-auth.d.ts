export type AuthPayload = {
  id: string
  token: string
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
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: AuthPayload
  }
}
