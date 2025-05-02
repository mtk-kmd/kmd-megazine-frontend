'use client'
import { z } from 'zod'
import Link from 'next/link'
import { toast } from 'sonner'
import React, { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/features/auth/utils/schema'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Eye, EyeClosed } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Session } from 'next-auth'
import { useSendVerificationMail } from '@/features/auth/api/auth'

const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutate: sendVerificationMail, isPending: isSendingVerificationMail } =
    useSendVerificationMail()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const redirectFrom = searchParams.get('redirectFrom') || '/'
    setIsSubmitting(true)

    try {
      const response = await signIn('credentials', {
        username: values.email,
        password: values.password,
        redirect: false,
      })

      if (!response) {
        toast.error('Authentication failed', { position: 'top-right' })
        return
      }

      if (!response.ok) {
        toast.error(response.error, { position: 'top-right' })
      } else {
        const res = await fetch('/api/auth/session')
        const session: Session = await res.json()

        if (session.is_authenticated) {
          toast.success('You’ve successfully logged in.', {
            position: 'top-right',
          })
          return router.push(redirectFrom)
        } else {
          sendVerificationMail(session.user.data.user_id, {
            onSuccess: () => {
              router.push(
                `/verify-otp?user_id=${session.user.data.user_id}&email=${values.email}`
              )
            },
          })
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, { position: 'top-right' })
      } else {
        toast.error('An unexpected error occurred.', {
          position: 'top-right',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisible = () => {
    setIsPasswordVisible((visible) => !visible)
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold">
          👋 Welcome to Campus Chronicles!
        </h1>
        <p className="text-muted-foreground">Let&apos;s log you in.</p>
      </div>

      <Form {...loginForm}>
        <form className="space-y-6" onSubmit={loginForm.handleSubmit(onSubmit)}>
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@gmail.com"
                    disabled={isSendingVerificationMail || isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link href="/forgot-password">
                    <Button variant="link" className="px-0">
                      Forgot Password
                    </Button>
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="6+ characters"
                      className="pr-6"
                      {...field}
                      disabled={isSendingVerificationMail || isSubmitting}
                      type={isPasswordVisible ? 'text' : 'password'}
                    />
                    <div className="absolute inset-y-0 right-0 flex h-full items-center justify-center p-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        type="button"
                        className="size-7"
                        onClick={togglePasswordVisible}
                      >
                        {isPasswordVisible ? (
                          <EyeClosed className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size="lg"
            type="submit"
            className="w-full"
            loading={isSubmitting || isSendingVerificationMail}
          >
            Login
          </Button>

          <p className="text-center text-muted-foreground">
            Want to access as a guest?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              <Button type="button" variant="link" className="px-0">
                Register
              </Button>
            </Link>
          </p>
        </form>
      </Form>
    </>
  )
}

const Login = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

export default Login
