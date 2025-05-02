'use client'
import { z } from 'zod'
import Link from 'next/link'
import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/features/auth/utils/schema'
import { ControllerRenderProps, useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, Check, EyeClosed, ChevronDown } from 'lucide-react'

import {
  useCreateUser,
  useAssignStudentToFaculty,
} from '@/features/users/api/users'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ROLE } from '@/utils/constants'
import { useGetFalculties } from '@/features/falculty/api/falculty'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAssignGuestToFaculty } from '../../api/auth'
import { useRouter } from 'next/navigation'

const Register = () => {
  const router = useRouter()
  const [isFacultySelectOpen, setIsFacultySelectOpen] = useState(false)
  const { mutate: createUserMutate, isPending: isCreateUserMutating } =
    useCreateUser('')

  const {
    mutate: assignGuestToFacultyMutate,
    isPending: isAssignGuestToFacultyMutating,
  } = useAssignGuestToFaculty()

  const {
    error,
    isSuccess,
    data = [],
    isFetching: isGetFalcultiesFetching,
  } = useGetFalculties('', true)

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      faculty_id: '',
      role: ROLE['guest'],
    },
  })

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
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
          assignGuestToFacultyMutate({
            faculty_id: parseInt(values.faculty_id),
            guest_id: data.result.user.user_id,
          })

          setTimeout(() => {
            router.push('/login')
          }, 1500)
        },
      }
    )
  }

  const togglePasswordVisible = () => {
    setIsPasswordVisible((visible) => !visible)
  }

  const renderFaculties = (
    field: ControllerRenderProps<z.infer<typeof signupSchema>, 'faculty_id'>
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
                    signupForm.setValue(
                      'faculty_id',
                      faculty.faculty_id.toString(),
                      {
                        shouldValidate: true,
                      }
                    )
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
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold">👋 Guest Registration</h1>
        <p className="text-muted-foreground">
          Create a guest account to access Campus Chronicles
        </p>
      </div>

      <Form {...signupForm}>
        <form
          className="space-y-6"
          onSubmit={signupForm.handleSubmit(onSubmit)}
        >
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
            <FormField
              control={signupForm.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        isCreateUserMutating || isAssignGuestToFacultyMutating
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
              control={signupForm.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        isCreateUserMutating || isAssignGuestToFacultyMutating
                      }
                      placeholder="Enter last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={signupForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={
                      isCreateUserMutating || isAssignGuestToFacultyMutating
                    }
                    placeholder="Enter username"
                    {...field}
                  />
                </FormControl>
                <FormControl />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
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
                        className="w-full justify-between pr-2"
                        disabled={
                          isCreateUserMutating || isAssignGuestToFacultyMutating
                        }
                      >
                        {(() => {
                          const faculty = field.value
                            ? data.find(
                                (faculty) =>
                                  faculty.faculty_id.toString() === field.value
                              )
                            : null

                          return faculty ? `${faculty.name}` : 'Select faculty'
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
              </FormItem>
            )}
          />

          <FormField
            control={signupForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
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
            loading={isCreateUserMutating || isAssignGuestToFacultyMutating}
          >
            Sign Up
          </Button>

          <p className="text-center text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              <Button type="button" variant="link" className="px-0">
                Login
              </Button>
            </Link>
          </p>
        </form>
      </Form>
    </>
  )
}

export default Register
