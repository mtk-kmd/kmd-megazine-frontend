'use client'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEditUser, useGetUser } from '@/features/users/api/users'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { editManagerSchema } from '@/features/users/utils/validator'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'
import { ROLE } from '@/utils/constants'
import { useQueryClient } from '@tanstack/react-query'
import { PhoneInput } from '@/components/ui/phone-input'
import {
  UserEditPayload,
  UserWithOptionalFaculty,
} from '@/features/users/types'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const EditManager = () => {
  const router = useRouter()
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session.data?.user.token as string
  const params = useParams<{ managerId: string }>()

  const { isPending: isUserEditMutating, mutate: userEditMutate } =
    useEditUser(accessToken)

  const form = useForm<z.infer<typeof editManagerSchema>>({
    resolver: zodResolver(editManagerSchema),
    defaultValues: {
      user_id: Number(params.managerId),
      user_name: '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      status: true,
      role: ROLE['manager'],
    },
  })

  const { isSuccess, error, data, isLoading } = useGetUser(
    accessToken,
    Number(params.managerId),
    !!accessToken
  )

  const resetForm = (user: UserWithOptionalFaculty) => {
    form.reset({
      user_id: user.user_id,
      user_name: user.user_name,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      role: user.role?.role_id || ROLE['manager'],
      status: user.status,
    })
  }

  useEffect(() => {
    if (!isLoading && isSuccess && data && data.result) {
      resetForm(data.result)
    }
  }, [isSuccess, data, isLoading])

  const handleResetForm = () => {
    if (data && data.result) {
      resetForm(data.result)
    }
  }

  const onSubmit = async (values: z.infer<typeof editManagerSchema>) => {
    userEditMutate(_.omit(values) as UserEditPayload, {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['users', Number(params.managerId)],
        })
      },
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex flex-col gap-y-5 pb-10">
        <span>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto flex flex-col gap-y-5 pb-10">
        <span>{error.message}</span>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto flex flex-col gap-y-5 px-4 py-6 pt-5 sm:px-6 lg:px-8">
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => router.push('/managers')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-lg font-semibold">Edit Manager</h1>
              <p className="mt-2 text-sm">
                Update the details of the manager in your institute.
              </p>
            </div>
          </div>
          <Form {...form}>
            <form
              id="edit-manager-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUserEditMutating}
                          placeholder="Enter username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUserEditMutating}
                          placeholder="Enter first name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUserEditMutating}
                          placeholder="Enter last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUserEditMutating}
                          placeholder="Enter coordinator email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          disabled={isUserEditMutating}
                          international
                          defaultCountry="MM"
                          className="shadow-none"
                          placeholder="Enter a phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  disabled={isUserEditMutating}
                  onClick={handleResetForm}
                  variant="secondary"
                >
                  Reset
                </Button>
                <Button
                  loading={isUserEditMutating}
                  form="edit-manager-form"
                  type="submit"
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
  }

  return null
}

export default EditManager
