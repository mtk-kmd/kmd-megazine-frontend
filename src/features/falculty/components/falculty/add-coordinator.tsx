import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { toast } from 'sonner'
import { ROLE } from '@/utils/constants'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { Eye, EyeClosed } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { PhoneInput } from '@/components/ui/phone-input'
import { useCreateUser } from '@/features/users/api/users'
import { addCoordinatorSchema } from '@/features/users/utils/validator'

const initialCoordinatorFormValues = {
  username: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  password: '',
  role: ROLE['marketing_coordinator'],
}

const AddCoordinator: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session?.data?.user?.token as string
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const { mutate: createUserMutate, isPending: isCreateUserMutating } =
    useCreateUser(accessToken)

  const form = useForm<z.infer<typeof addCoordinatorSchema>>({
    resolver: zodResolver(addCoordinatorSchema),
    defaultValues: { ...initialCoordinatorFormValues },
  })

  const onDismiss = (open: boolean) => {
    if (!isCreateUserMutating) {
      onOpenChange(open)
    }
  }

  const onSubmit = async (values: z.infer<typeof addCoordinatorSchema>) => {
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
        async onSuccess(data, variables, context) {
          await queryClient.invalidateQueries({
            queryKey: ['users', 'role', 'marketing coordinator'],
          })
        },
        onError(error, variables, context) {
          toast.error(error.message)
        },
        onSettled(data, error, variables, context) {
          onDismiss(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onDismiss}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add New Coordinator</DialogTitle>
          <DialogDescription>
            Fill in the coordinator details below
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-coordinator-form"
            className="flex-1 overflow-y-auto"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid w-full grid-cols-1 gap-3 p-0.5 md:grid-cols-2">
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
                        className="shadow-none"
                        disabled={isCreateUserMutating}
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
                              setIsPasswordVisible(!isPasswordVisible)
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
        <DialogFooter className="p-1">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isCreateUserMutating}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="flex-1"
            form="add-coordinator-form"
            loading={isCreateUserMutating}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddCoordinator
