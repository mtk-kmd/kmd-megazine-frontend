import React from 'react'
import { Metadata } from 'next'
import VerifyOtp from '@/features/auth/components/verify-otp'

export const metadata: Metadata = {
  title: 'Verify OTP',
  description: 'Verify your one-time password to complete authentication',
}

const VerifyOtpPage = () => {
  return <VerifyOtp />
}

export default VerifyOtpPage
