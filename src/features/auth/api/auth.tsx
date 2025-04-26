import axios from 'axios'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'

const sendVerificationMail = async ({
  user_id,
}: {
  user_id: number
}): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>(
      '/sendVerificationMail',
      { user_id }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to send verification mail.')
  }
}

export const useSendVerificationMail = () => {
  return useMutation({
    mutationFn: (user_id: number) => sendVerificationMail({ user_id }),
    onSuccess() {
      toast.success('An OTP code has been sent to your email address.', {
        position: 'top-right',
      })
    },
    onError(error) {
      toast.error(error.message, { position: 'top-right' })
    },
  })
}

const verifyUser = async ({
  payload,
}: {
  payload: { email: string; auth_code: number }
}): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>(
      '/verifyUser',
      payload
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Invalid OTP code. Please try again.')
  }
}

export const useVerifyUser = () => {
  return useMutation({
    mutationFn: (payload: { email: string; auth_code: number }) =>
      verifyUser({ payload }),
    onSuccess() {
      toast.success(
        'Account has been verified successfully. Please login again.',
        {
          position: 'top-right',
        }
      )
    },
    onError(error) {
      toast.error(error.message, { position: 'top-right' })
    },
  })
}
