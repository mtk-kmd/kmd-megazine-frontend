'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useGetUser } from '@/features/users/api/users'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { editStudentSchema } from '../../utils/validator'
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
import { Check, ChevronsDown, Eye, EyeClosed } from 'lucide-react'
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

const EditStudent = () => {
  const session = useSession()
  const accessToken = session.data?.user.token as string
  const params = useParams<{ studentId: string }>()

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFacultySelectOpen, setIsFacultySelectOpen] = useState(false)

  const form = useForm<z.infer<typeof editStudentSchema>>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: '',
      faculty_id: '',
      role: ROLE['student'],
    },
  })

  const {
    error: getFacultyError,
    isSuccess: isGetFacultySuccess,
    data: faculties = [],
    isFetching: isGetFalcultiesFetching,
  } = useGetFalculties(accessToken, !!accessToken)

  const { isFetching, isSuccess, error, data } = useGetUser(
    accessToken,
    Number(params.studentId),
    !!accessToken
  )

  const togglePasswordVisible = (open: boolean) => {
    setIsPasswordVisible(open)
  }

  useEffect(() => {
    if (!isFetching && isSuccess && data && data.result) {
      const user = data.result

      form.reset({
        username: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone ? user.phone : '',
        role: user.role?.role_id || ROLE['student'],
        password: '',
        faculty_id: '',
      })
    }
  }, [isSuccess, data, isFetching, form])

  const onSubmit = async (values: z.infer<typeof editStudentSchema>) => {
    console.log(values)
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

  if (isFetching) {
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
                  name="username"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
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
                        <Input placeholder="Enter first name" {...field} />
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
                        <Input placeholder="Enter last name" {...field} />
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
                              <ChevronsDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            {renderFaculties(field)}
                          </PopoverContent>
                        </Popover>
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
                        <Input placeholder="Enter student email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        defaultCountry="MM"
                        disabled={
                          isCreateUserMutating ||
                          isAssignStudentToFacultyMutating
                        }
                        className="shadow-none"
                        placeholder="Enter a phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                /> */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="6+ characters"
                            className="pr-6"
                            {...field}
                            type={isPasswordVisible ? 'text' : 'password'}
                          />
                          <div className="absolute inset-y-0 right-0 flex h-full items-center justify-center p-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              type="button"
                              className="size-7"
                              onClick={() =>
                                togglePasswordVisible(!isPasswordVisible)
                              }
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
              </div>
            </form>
          </Form>
          <div className="flex justify-end gap-3">
            <Button variant="secondary">Reset</Button>
            <Button form="edit-student-form" type="submit">
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
