'use client'
import { z } from 'zod'
import { toast } from 'sonner'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPSlot } from '@/components/ui/input-otp'
import { verifyOtpSchema } from '@/features/auth/utils/schema'
import {
  useSendVerificationMail,
  useVerifyUser,
} from '@/features/auth/api/auth'

const VerifyOtp = () => {
  const router = useRouter()

  const { mutate: verifyUser, isPending: isVerifyingUser } = useVerifyUser()
  const { mutate: sendVerificationMail, isPending: isSendingVerificationMail } =
    useSendVerificationMail()

  const searchParams = useSearchParams()

  const email = searchParams.get('email') || ''
  const userId = searchParams.get('user_id')

  const form = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: '',
      auth_code: '',
    },
  })

  useEffect(() => {
    if (email) {
      form.setValue('email', email)
    }
  }, [email, form])

  const onSubmit = async (values: z.infer<typeof verifyOtpSchema>) => {
    verifyUser(
      {
        email: values.email,
        auth_code: parseInt(values.auth_code),
      },
      {
        onSuccess() {
          router.push('/login')
        },
      }
    )
  }

  const handleResendOtp = () => {
    if (userId) {
      sendVerificationMail(parseInt(userId), {
        onSuccess() {
          form.setValue('auth_code', '')
        },
      })
    } else {
      toast.error('ID is required to resend verification code.', {
        position: 'top-right',
      })
    }
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold">Verify Your Account</h1>
        <p className="text-muted-foreground">
          Enter the 6-digit code sent to your{' '}
          <span className="font-bold text-secondary-foreground">{email}</span>{' '}
          to complete verification.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="auth_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP code</FormLabel>
                <FormControl>
                  <InputOTP
                    disabled={isVerifyingUser || isSendingVerificationMail}
                    maxLength={6}
                    {...field}
                  >
                    <div className="flex w-full justify-between gap-0">
                      <InputOTPSlot
                        index={0}
                        className="mx-1 h-10 flex-1 rounded-lg border border-border first:ml-0 first:rounded-l-lg"
                      />
                      <InputOTPSlot
                        index={1}
                        className="mx-1 h-10 flex-1 rounded-lg border border-border"
                      />
                      <InputOTPSlot
                        index={2}
                        className="mx-1 h-10 flex-1 rounded-lg border border-border"
                      />
                      <InputOTPSlot
                        index={3}
                        className="mx-1 h-10 flex-1 rounded-lg border border-border"
                      />
                      <InputOTPSlot
                        index={4}
                        className="mx-1 h-10 flex-1 rounded-lg border border-border"
                      />
                      <InputOTPSlot
                        index={5}
                        className="mx-1 h-10 flex-1 rounded-lg border border-border last:mr-0 last:rounded-r-lg"
                      />
                    </div>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSendingVerificationMail || isVerifyingUser}
          >
            Verify OTP
          </Button>

          <div className="mt-2 text-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive a code?{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 font-medium"
                onClick={handleResendOtp}
                disabled={isSendingVerificationMail || isVerifyingUser}
              >
                Resend
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </>
  )
}

export default VerifyOtp
