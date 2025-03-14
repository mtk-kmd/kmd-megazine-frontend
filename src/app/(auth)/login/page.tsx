import React from 'react'
import { Metadata } from 'next'
import Login from '@/features/auth/components/login'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to access your account',
}

const LoginPage = () => {
  return <Login />
}

export default LoginPage
