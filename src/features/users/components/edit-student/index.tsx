'use client'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEditUser, useGetUser } from '@/features/users/api/users'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { editStudentSchema } from '@/features/users/utils/validator'
import { z } from 'zod'
import { useGetFalculties } from '@/features/falculty/api/falculty'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Check, ChevronDown, ChevronLeft, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ROLE } from '@/utils/constants'
import { useQueryClient } from '@tanstack/react-query'
import { PhoneInput } from '@/components/ui/phone-input'
import {
  UserEditPayload,
  UserWithOptionalFaculty,
} from '@/features/users/types'

const EditStudent = () => {
  const router = useRouter()
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session.data?.user.token as string
  const params = useParams<{ studentId: string }>()

  const { isPending: isUserEditMutating, mutate: userEditMutate } =
    useEditUser(accessToken)

  const [isFacultySelectOpen, setIsFacultySelectOpen] = useState(false)

  const form = useForm<z.infer<typeof editStudentSchema>>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      user_id: Number(params.studentId),
      user_name: '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      status: true,
      role: ROLE['student'],
    },
  })

  const {
    error: getFacultyError,
    isSuccess: isGetFacultySuccess,
    data: faculties = [],
    isFetching: isGetFalcultiesFetching,
  } = useGetFalculties(accessToken, !!accessToken)

  const { isSuccess, error, data, isLoading } = useGetUser(
    accessToken,
    Number(params.studentId),
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
      role: user.role?.role_id || ROLE['student'],
      status: user.status,
      faculty_id: user.StudentFaculty?.faculty_id?.toString() || '',
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

  const onSubmit = async (values: z.infer<typeof editStudentSchema>) => {
    userEditMutate(_.omit(values, ['faculty_id']) as UserEditPayload, {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['users', Number(params.studentId)],
        })
      },
    })
  }

  const renderFaculties = (
    field: ControllerRenderProps<
      z.infer<typeof editStudentSchema>,
      'faculty_id'
    >
  ) => {
    if (isGetFalcultiesFetching) {
      return <span>Loading...</span>
    }

    if (getFacultyError) {
      return <span>{getFacultyError.message}</span>
    }

    if (isGetFacultySuccess) {
      return (
        <Command>
          <CommandInput placeholder="Search faculty..." />
          <CommandList>
            <CommandEmpty>No faculty found.</CommandEmpty>
            <CommandGroup>
              {faculties.map((faculty) => (
                <CommandItem
                  key={faculty.faculty_id}
                  value={faculty.name}
                  onSelect={() => {
                    form.setValue('faculty_id', faculty.faculty_id.toString(), {
                      shouldValidate: true,
                    })
                    setIsFacultySelectOpen(false)
                  }}
                >
                  {faculty.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      field.value === faculty.faculty_id.toString()
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )
    }

    return null
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
          onClick={() => router.push('/students')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-lg font-semibold">Edit Student</h1>
              <p className="mt-2 text-sm">
                Update the details of the student in your institute.
              </p>
            </div>
          </div>
          <Form {...form}>
            <form
              id="edit-student-form"
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
                          className="h-10"
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
                          className="h-10"
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
                          className="h-10"
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
                          className="h-10"
                          disabled={isUserEditMutating}
                          placeholder="Enter student email"
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
                          className="shadow-none [&>input]:h-10"
                          placeholder="Enter a phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="faculty_id"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Select Faculty</FormLabel>
                      <FormControl>
                        <Popover
                          open={isFacultySelectOpen}
                          onOpenChange={setIsFacultySelectOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={true}
                              aria-expanded={isFacultySelectOpen}
                              className="h-10 w-full justify-between pr-1.5"
                            >
                              {(() => {
                                const faculty = field.value
                                  ? faculties.find(
                                      (faculty) =>
                                        faculty.faculty_id.toString() ===
                                        field.value
                                    )
                                  : null

                                return faculty
                                  ? `${faculty.name}`
                                  : 'Select faculty'
                              })()}
                              <ChevronDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            {renderFaculties(field)}
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="flex items-start text-muted-foreground">
                        <Info className="mr-1 mt-0.5 size-3.5" />
                        The faculty field is pre-defined and cannot be edited.
                      </FormDescription>
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
                  form="edit-student-form"
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

export default EditStudent
