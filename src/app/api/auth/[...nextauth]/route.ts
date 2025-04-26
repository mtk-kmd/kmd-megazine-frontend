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
              email: credentials.username,
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
            is_authenticated: true,
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            const errorResponse = error.response.data as any

            console.log(errorResponse);

            if (
              errorResponse.message === 'User is not verified' &&
              errorResponse.user_id
            ) {
              return {
                token: '',
                data: {
                  user_id: errorResponse.user_id,
                  user_name: '',
                  first_name: '',
                  last_name: '',
                  email: '',
                  phone: null,
                  auth: null,
                  role_id: 0,
                  auth_id: 0,
                  status: false,
                  createdAt: '',
                  updatedAt: '',
                },
                is_authenticated: false,
              }
            }
            throw new Error(errorResponse.message || errorResponse.detail || 'Authentication failed')
          } else {
            throw new Error('An unexpected error occurred')
          }
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
        token.is_authenticated = user.is_authenticated
      }

      return token
    },
    async session({ session, token }) {
      session.user = token.user
      session.is_authenticated = token.is_authenticated
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
