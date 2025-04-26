import { Metadata } from 'next'
import React from 'react'
import Register from '@/features/auth/components/login'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a new account',
}

const RegisterPage = () => {
  return <Register />
}

export default RegisterPage
