'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { addStudentSchema } from '@/features/users/utils/validator'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Check, ChevronsUpDown, Eye, EyeClosed } from 'lucide-react'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useGetFalculties } from '@/features/falculty/api/falculty'

import {
  useCreateUser,
  useAssignStudentToFaculty,
} from '@/features/users/api/users'
import { ROLE } from '@/utils/constants'
import { useQueryClient } from '@tanstack/react-query'

const initialStudentFormValues = {
  username: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  password: '',
  faculty_id: '',
  role: ROLE['student'],
}

const AddStudent: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const session = useSession()
  const apolloClient = useQueryClient()

  const accessToken = session?.data?.user?.token as string
  const { mutate: createUserMutate, isPending: isCreateUserMutating } =
    useCreateUser(accessToken)

  const {
    mutate: assignStudentToFacultyMutate,
    isPending: isAssignStudentToFacultyMutating,
  } = useAssignStudentToFaculty(accessToken)

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFacultySelectOpen, setIsFacultySelectOpen] = useState(false)

  const {
    error,
    isSuccess,
    data = [],
    isFetching: isGetFalcultiesFetching,
  } = useGetFalculties(accessToken, !!accessToken)

  const form = useForm<z.infer<typeof addStudentSchema>>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: { ...initialStudentFormValues },
  })

  const onSubmit = async (values: z.infer<typeof addStudentSchema>) => {
    createUserMutate(
      {
        username: values.username,
        password: values.password,
        role: values.role,
        email: values.email,
        phone: values.phone,
        first_name: values.first_name,
        last_name: values.last_name,
      },
      {
        onSuccess(data) {
          assignStudentToFacultyMutate(
            {
              faculty_id: parseInt(values.faculty_id),
              student_id: data.result.user.user_id,
            },
            {
              async onSuccess() {
                await apolloClient.invalidateQueries({
                  queryKey: ['users', 'role', 'student'],
                })
                handleOnDismiss(false)
              },
            }
          )
        },
      }
    )
  }

  const togglePasswordVisible = (open: boolean) => {
    setIsPasswordVisible(open)
  }

  const handleOnDismiss = (open: boolean) => {
    if (!isCreateUserMutating && !isAssignStudentToFacultyMutating) {
      form.reset({ ...initialStudentFormValues })
      onOpenChange(open)
    }
  }

  const renderFaculties = (
    field: ControllerRenderProps<z.infer<typeof addStudentSchema>, 'faculty_id'>
  ) => {
    if (isGetFalcultiesFetching) {
      return <span>Loading...</span>
    }

    if (error) {
      return <span>{error.message}</span>
    }

    if (isSuccess) {
      return (
        <Command>
          <CommandInput placeholder="Search faculty..." />
          <CommandList>
            <CommandEmpty>No faculty found.</CommandEmpty>
            <CommandGroup>
              {data.map((faculty) => (
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

  return (
    <Drawer open={open} onOpenChange={handleOnDismiss}>
      <DrawerContent className="flex h-full max-h-[calc(100dvh-0.75rem)] flex-col">
        <DrawerHeader className="mx-auto w-full max-w-md">
          <DrawerTitle>Add New Student</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to add a new student to the system.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            id="add-student-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto"
          >
            <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-3 p-4 pt-0 md:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={
                          isCreateUserMutating ||
                          isAssignStudentToFacultyMutating
                        }
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
                        disabled={
                          isCreateUserMutating ||
                          isAssignStudentToFacultyMutating
                        }
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
                        disabled={
                          isCreateUserMutating ||
                          isAssignStudentToFacultyMutating
                        }
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
                            aria-expanded={isFacultySelectOpen}
                            className="w-full justify-between"
                            disabled={
                              isCreateUserMutating ||
                              isAssignStudentToFacultyMutating
                            }
                          >
                            {(() => {
                              const faculty = field.value
                                ? data.find(
                                    (faculty) =>
                                      faculty.faculty_id.toString() ===
                                      field.value
                                  )
                                : null

                              return faculty
                                ? `${faculty.name}`
                                : 'Select faculty'
                            })()}
                            <ChevronsUpDown className="opacity-50" />
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
                      <Input
                        disabled={
                          isCreateUserMutating ||
                          isAssignStudentToFacultyMutating
                        }
                        placeholder="Enter student email"
                        {...field}
                      />
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
                          disabled={
                            isCreateUserMutating ||
                            isAssignStudentToFacultyMutating
                          }
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
        <DrawerFooter className="mx-auto flex w-full max-w-md flex-col gap-3 lg:flex-row">
          <DrawerClose asChild>
            <Button
              disabled={
                isCreateUserMutating || isAssignStudentToFacultyMutating
              }
              className="lg:flex-1"
              variant="outline"
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            type="submit"
            className="lg:flex-1"
            form="add-student-form"
            disabled={isGetFalcultiesFetching}
            loading={isCreateUserMutating || isAssignStudentToFacultyMutating}
          >
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default AddStudent
