'use client'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'

import { z } from 'zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { addManagerSchema } from '@/features/users/utils/validator'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Eye, EyeClosed } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ROLE } from '@/utils/constants'
import { useQueryClient } from '@tanstack/react-query'
import { PhoneInput } from '@/components/ui/phone-input'
import { useCreateUser } from '@/features/users/api/users'

const initialFormValues = {
  username: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  password: '',
  role: ROLE['manager'],
}

const AddManager: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session?.data?.user?.token as string

  const { mutate: createUserMutate, isPending: isCreateUserMutating } =
    useCreateUser(accessToken)

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const form = useForm<z.infer<typeof addManagerSchema>>({
    resolver: zodResolver(addManagerSchema),
    defaultValues: { ...initialFormValues },
  })

  const onSubmit = async (values: z.infer<typeof addManagerSchema>) => {
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
        async onSuccess() {
          await queryClient.invalidateQueries({
            queryKey: ['users', 'role', 'manager'],
          })
          handleOnDismiss(false)
        },
      }
    )
  }

  const togglePasswordVisible = (open: boolean) => {
    setIsPasswordVisible(open)
  }

  const handleOnDismiss = (open: boolean) => {
    if (!isCreateUserMutating) {
      form.reset({ ...initialFormValues })
      onOpenChange(open)
    }
  }

  return (
    <Drawer open={open} onOpenChange={handleOnDismiss}>
      <DrawerContent className="flex h-full max-h-[calc(100dvh-0.75rem)] flex-col">
        <DrawerHeader className="mx-auto w-full max-w-md">
          <DrawerTitle>Add New Manager</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to add a new manager to the system.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            id="add-manager-form"
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
                        disabled={isCreateUserMutating}
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
                        disabled={isCreateUserMutating}
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
                        disabled={isCreateUserMutating}
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
                        disabled={isCreateUserMutating}
                        placeholder="Enter email"
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
                        international
                        defaultCountry="MM"
                        disabled={isCreateUserMutating}
                        className="shadow-none"
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
                          disabled={isCreateUserMutating}
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
              disabled={isCreateUserMutating}
              className="lg:flex-1"
              variant="outline"
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            type="submit"
            className="lg:flex-1"
            form="add-manager-form"
            loading={isCreateUserMutating}
          >
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default AddManager
