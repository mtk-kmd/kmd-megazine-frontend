'use client'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
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
import { Check, ChevronDown, Info } from 'lucide-react'
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
import { PhoneInput } from '@/components/ui/phone-input'
import { StudentFaculty, User, UserEditPayload } from '../../types'
import { useQueryClient } from '@tanstack/react-query'

const EditStudent = () => {
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

  const resetForm = (user: User & { StudentFaculty: StudentFaculty }) => {
    form.reset({
      user_id: user.user_id,
      user_name: user.user_name,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone ? user.phone : '',
      role: user.role?.role_id || ROLE['student'],
      status: user.status,
      faculty_id: user.StudentFaculty.faculty_id
        ? user.StudentFaculty.faculty_id.toString()
        : '',
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
      async onSuccess(data, variables, context) {
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
                  onSelect={(value) => {
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
      <div className="container mx-auto flex flex-col gap-y-5 pb-10 pt-5">
        <div className="mx-auto flex w-full max-w-md flex-col gap-5">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold">Edit Student</h1>
              <p className="mt-2 text-sm">
                Update the details of the student in your institute.
              </p>
            </div>
          </div>
          <Form {...form}>
            <form id="edit-student-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                              className="w-full justify-between"
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
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
            </form>
          </Form>
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
        </div>
      </div>
    )
  }

  return null
}

export default EditStudent
