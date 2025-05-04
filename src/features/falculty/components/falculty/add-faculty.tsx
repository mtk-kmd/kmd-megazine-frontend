import _ from 'lodash'
import { z } from 'zod'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ControllerRenderProps, useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
  DrawerDescription,
} from '@/components/ui/drawer'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNewFacultySchema } from '@/features/falculty/utils/validator'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import AddCoordiantor from './add-coordinator'
import { useGetUsers } from '@/features/users/api/users'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateFaculty } from '@/features/falculty/api/falculty'

import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown, CircleAlert } from 'lucide-react'

const initialFacultyValues = {
  name: '',
  coordinator_id: '',
}

const AddFaculty: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session?.data?.user?.token as string

  const [isCoordinatorAddOpen, setIsCoordinatorAddOpen] = useState(false)
  const [isCoordinatorSelectOpen, setIsCoordinatorSelectOpen] = useState(false)

  const {
    data = [],
    error,
    isSuccess,
    isLoading: isGetCoordinatorLoading,
  } = useGetUsers(accessToken as string, 'marketing coordinator', !!accessToken)

  const addFacultyForm = useForm<z.infer<typeof createNewFacultySchema>>({
    resolver: zodResolver(createNewFacultySchema),
    defaultValues: {
      name: '',
      coordinator_id: '',
    },
  })

  const { mutate: createFacultyMutate, isPending: isCreateFacultyMutating } =
    useCreateFaculty(accessToken)

  const handleOnDismiss = (open: boolean) => {
    if (!isCreateFacultyMutating) {
      addFacultyForm.reset({ ...initialFacultyValues })
      onOpenChange(open)
    }
  }

  const onSubmit = (values: z.infer<typeof createNewFacultySchema>) => {
    createFacultyMutate(
      { ...values, coordinator_id: Number(values.coordinator_id) },
      {
        async onSuccess() {
          await queryClient.invalidateQueries({
            queryKey: ['users', 'role', 'marketing coordinator'],
          })
          await queryClient.invalidateQueries({ queryKey: ['faculties'] })
          handleOnDismiss(false)
        },
        onError(error) {
          toast.error(error.message)
        },
      }
    )
  }

  const handleIsCoordinatorAddOpen = (open: boolean) => {
    setIsCoordinatorSelectOpen(false)
    setIsCoordinatorAddOpen(open)
  }

  const renderCoordinators = (
    field: ControllerRenderProps<
      z.infer<typeof createNewFacultySchema>,
      'coordinator_id'
    >
  ) => {
    if (isGetCoordinatorLoading) {
      return <span>Loading...</span>
    }

    if (error) {
      return <span>{error.message}</span>
    }

    if (isSuccess) {
      const newCoordinators = _.filter(
        data,
        (coordinator) => !coordinator?.Faculty
      )

      return (
        <Command>
          <CommandInput placeholder="Search coordinator..." />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center gap-3 p-4">
                <CircleAlert className="size-5 text-muted-foreground" />
                <p className="w-full max-w-48">
                  No coordinators are available to assign to the new faculty.
                </p>
                <Button
                  size="sm"
                  onClick={() => handleIsCoordinatorAddOpen(true)}
                >
                  Add New
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {newCoordinators.map((coordinator) => (
                <CommandItem
                  key={coordinator.user_id}
                  value={coordinator.user_name}
                  onSelect={() => {
                    addFacultyForm.setValue(
                      'coordinator_id',
                      coordinator.user_id.toString(),
                      {
                        shouldValidate: true,
                      }
                    )
                    setIsCoordinatorSelectOpen(false)
                  }}
                >
                  {coordinator.user_name}
                  <Check
                    className={cn(
                      'ml-auto',
                      field.value === coordinator.user_id.toString()
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
          <DrawerTitle>Add New Faculty</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to add a new faculty to the system.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...addFacultyForm}>
          <form
            id="add-faculty-form"
            className="flex-1 overflow-y-auto"
            onSubmit={addFacultyForm.handleSubmit(onSubmit)}
          >
            <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-5 p-4 pt-0 md:grid-cols-2">
              <FormField
                name="name"
                control={addFacultyForm.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Faculty Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
                        disabled={isCreateFacultyMutating}
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addFacultyForm.control}
                name="coordinator_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Select Coordinator</FormLabel>
                    <FormControl>
                      <Popover
                        open={isCoordinatorSelectOpen}
                        onOpenChange={setIsCoordinatorSelectOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="h-10 w-full justify-between pr-1.5"
                            disabled={isCreateFacultyMutating}
                          >
                            {(() => {
                              const coordinator = field.value
                                ? data.find(
                                    (coordinator) =>
                                      coordinator.user_id.toString() ===
                                      field.value
                                  )
                                : null

                              return coordinator
                                ? `${coordinator.user_name}`
                                : 'Select Coordinator'
                            })()}
                            <ChevronsUpDown
                              className="opacity-50"
                              strokeWidth={1.5}
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          {renderCoordinators(field)}
                        </PopoverContent>
                      </Popover>
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
              variant="outline"
              className="lg:flex-1"
              disabled={isCreateFacultyMutating}
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            loading={isCreateFacultyMutating}
            type="submit"
            className="lg:flex-1"
            form="add-faculty-form"
          >
            Submit
          </Button>
        </DrawerFooter>

        <AddCoordiantor
          open={isCoordinatorAddOpen}
          onOpenChange={handleIsCoordinatorAddOpen}
        />
      </DrawerContent>
    </Drawer>
  )
}

export default AddFaculty
