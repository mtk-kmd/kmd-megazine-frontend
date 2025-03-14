import axios from 'axios'
import NextAuth from 'next-auth/next'

import { NextAuthOptions } from 'next-auth'
import { AuthPayload } from '@/types/next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface LoginApiResponse {
  message: string
  token: string
  result: {
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

interface ErrorResponse {
  detail: string
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username*', type: 'text' },
        password: { label: 'Password*', type: 'password' },
      },

      // @ts-ignore
      async authorize(credentials, req): Promise<AuthPayload> {
        if (!credentials || !credentials.username || !credentials.password) {
          throw new Error('Missing username or password')
        }

        try {
          const response = await axios.post<LoginApiResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/login`,
            {
              user_name: credentials.username,
              password: credentials.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          const data = response.data

          return {
            token: data.token,
            data: data.result,
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            const errorData = error.response.data as ErrorResponse
            throw new Error(errorData.detail || 'Authentication failed')
          } else {
            console.error('Authentication error:', error)
            throw new Error('An unexpected error occurred')
          }
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user
      }

      return token
    },
    async session({ session, token }) {
      session.user = token.user
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 10,
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions)

export { handler as GET, handler as POST }
