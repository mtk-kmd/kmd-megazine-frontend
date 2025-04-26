'use client'
import { z } from 'zod'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useUpdateFaculty } from '@/features/users/api/users'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { useGetFaculty } from '@/features/falculty/api/falculty'
import { FacultyResponseItem } from '@/features/falculty/types'
import { editFacultySchema } from '@/features/falculty/utils/validator'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { toast } from 'sonner'

const EditFaculty = () => {
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session.data?.user.token as string
  const params = useParams<{ facultyId: string }>()

  const { mutate: updateFacultyMutate, isPending: isUpdateFacultyMutating } =
    useUpdateFaculty(accessToken)

  const form = useForm<z.infer<typeof editFacultySchema>>({
    resolver: zodResolver(editFacultySchema),
    defaultValues: {
      faculty_id: '',
      name: '',
      coordinator_id: '',
    },
  })

  const { isSuccess, error, data, isLoading } = useGetFaculty(
    accessToken,
    Number(params.facultyId),
    !!accessToken
  )

  const resetForm = (faculty: FacultyResponseItem) => {
    form.reset({
      name: faculty.name,
      coordinator_id: faculty.coordinator?.user_id.toString(),
      faculty_id: faculty.faculty_id.toString(),
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

  const onSubmit = async (values: z.infer<typeof editFacultySchema>) => {
    updateFacultyMutate(
      {
        ...values,
        faculty_id: Number(values.faculty_id),
        coordinator_id: Number(values.coordinator_id),
      },
      {
        async onSuccess() {
          await queryClient.invalidateQueries({
            queryKey: ['faculty', Number(params.facultyId)],
          })
          toast.success(
            'The faculty information has been successfully updated.'
          )
        },
      }
    )
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
      <div className="container mx-auto flex flex-col gap-y-5 pb-10 pt-5">
        <div className="mx-auto flex w-full max-w-md flex-col gap-5">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-lg font-semibold">Edit Faculty</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Update the faculty details as needed.
              </p>
            </div>
          </div>
          <Form {...form}>
            <form
              id="edit-coordinator-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Faculty Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUpdateFacultyMutating}
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2 flex flex-col gap-2">
                  <Label>Coordinator</Label>
                  <Card className="p-0 shadow-none">
                    <CardContent className="p-4">
                      <li className="flex items-center justify-between gap-x-6">
                        <div className="flex min-w-0 gap-x-4">
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold text-secondary-foreground">
                              {data.result.coordinator?.user_name}
                            </p>
                            <p className="truncate text-xs/5 text-muted-foreground">
                              {data.result.coordinator?.email}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/coordinators/${data.result.coordinator?.user_id}`}
                        >
                          <Button
                            variant="secondary"
                            className="rounded-full border border-input"
                          >
                            View
                          </Button>
                        </Link>
                      </li>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
          <div className="flex justify-end gap-3">
            <Button
              disabled={isUpdateFacultyMutating}
              onClick={handleResetForm}
              variant="secondary"
            >
              Reset
            </Button>
            <Button
              loading={isUpdateFacultyMutating}
              form="edit-coordinator-form"
              type="submit"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default EditFaculty
