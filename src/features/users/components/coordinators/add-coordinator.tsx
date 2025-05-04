'use client'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import _ from 'lodash'
import React, { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
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
import {
  Check,
  ChevronsUpDown,
  CircleAlert,
  Eye,
  EyeClosed,
} from 'lucide-react'

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

import AddFaculty from './add-faculty'
import { ROLE } from '@/utils/constants'
import { PhoneInput } from '@/components/ui/phone-input'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateUser, useUpdateFaculty } from '@/features/users/api/users'

const initialCoordinatorFormValues = {
  username: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  password: '',
  faculty_id: '',
  role: ROLE['marketing_coordinator'],
}

const AddCoordinator: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session?.data?.user?.token as string

  const [isFacultyAddOpen, setIsFacultyAddOpen] = useState(false)

  const [selectedFaculty, setSelectedFaculty] = useState<{
    name: string
    faculty_id: number
  } | null>(null)

  const { mutate: createUserMutate, isPending: isCreateUserMutating } =
    useCreateUser(accessToken)

  const { mutate: updateFacultyMutate, isPending: isUpdateFacultyMutating } =
    useUpdateFaculty(accessToken)

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
    defaultValues: { ...initialCoordinatorFormValues },
  })

  const handleIsFacultyAddOpen = (open: boolean) => {
    setIsFacultySelectOpen(false)
    setIsFacultyAddOpen(open)
  }

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
          updateFacultyMutate(
            {
              faculty_id: parseInt(values.faculty_id),
              coordinator_id: data.result.user.user_id,
              name: selectedFaculty?.name || '',
            },
            {
              async onSuccess() {
                await queryClient.invalidateQueries({
                  queryKey: ['users', 'role', 'marketing coordinator'],
                })
                await queryClient.invalidateQueries({ queryKey: ['faculties'] })
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
    if (!isCreateUserMutating && !isUpdateFacultyMutating) {
      form.reset({ ...initialCoordinatorFormValues })
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
      const newFaculties = _.filter(data, (faculty) => !faculty.coordinator)

      return (
        <Command>
          <CommandInput placeholder="Search faculty..." />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center gap-3 p-4">
                <CircleAlert className="size-5 text-muted-foreground" />
                <p className="w-full max-w-48">
                  No faculties are available to assign to the new user.
                </p>
                <Button size="sm" onClick={() => handleIsFacultyAddOpen(true)}>
                  Add New
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {newFaculties.map((faculty) => (
                <CommandItem
                  key={faculty.faculty_id}
                  value={faculty.name}
                  onSelect={() => {
                    form.setValue('faculty_id', faculty.faculty_id.toString(), {
                      shouldValidate: true,
                    })
                    setSelectedFaculty({
                      faculty_id: faculty.faculty_id,
                      name: faculty.name,
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
          <DrawerTitle>Add New Coordinator</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to add a new coordinator to the system.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            id="add-coordinator-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto"
          >
            <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-5 p-4 pt-0 md:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={
                          isCreateUserMutating || isUpdateFacultyMutating
                        }
                        placeholder="Enter username"
                        {...field}
                        className="h-10"
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
                          isCreateUserMutating || isUpdateFacultyMutating
                        }
                        placeholder="Enter first name"
                        {...field}
                        className="h-10"
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
                          isCreateUserMutating || isUpdateFacultyMutating
                        }
                        placeholder="Enter last name"
                        {...field}
                        className="h-10"
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
                            className="h-10 w-full justify-between pr-1.5"
                            disabled={
                              isCreateUserMutating || isUpdateFacultyMutating
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
                            <ChevronsUpDown
                              className="opacity-50"
                              strokeWidth={1.5}
                            />
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
                          isCreateUserMutating || isUpdateFacultyMutating
                        }
                        placeholder="Enter email"
                        {...field}
                        className="h-10"
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
                        international
                        defaultCountry="MM"
                        disabled={
                          isCreateUserMutating || isUpdateFacultyMutating
                        }
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
                name="password"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled={
                            isCreateUserMutating || isUpdateFacultyMutating
                          }
                          placeholder="6+ characters"
                          className="h-10 pr-6"
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
              disabled={isCreateUserMutating || isUpdateFacultyMutating}
              className="lg:flex-1"
              variant="outline"
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            type="submit"
            className="lg:flex-1"
            form="add-coordinator-form"
            disabled={isGetFalcultiesFetching}
            loading={isCreateUserMutating || isUpdateFacultyMutating}
          >
            Submit
          </Button>
        </DrawerFooter>

        <AddFaculty
          open={isFacultyAddOpen}
          onOpenChange={handleIsFacultyAddOpen}
        />
      </DrawerContent>
    </Drawer>
  )
}

export default AddCoordinator
