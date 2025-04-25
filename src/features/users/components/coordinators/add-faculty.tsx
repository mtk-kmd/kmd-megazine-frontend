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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useCreateFaculty } from '@/features/falculty/api/falculty'
import { createFacultySchema } from '@/features/falculty/utils/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { CircleAlertIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const AddFaculty: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session?.data?.user?.token as string

  const addFacultyForm = useForm<z.infer<typeof createFacultySchema>>({
    resolver: zodResolver(createFacultySchema),
    defaultValues: {
      name: '',
      coordinator_id: null,
    },
  })

  const { mutate: createFacultyMutate, isPending: isCreateFacultyMutating } =
    useCreateFaculty(accessToken)

  const onDismiss = (open: boolean) => {
    if (!isCreateFacultyMutating) {
      onOpenChange(open)
    }
  }

  const onSubmit = (values: z.infer<typeof createFacultySchema>) => {
    createFacultyMutate(values, {
      async onSuccess(data, variables, context) {
        await queryClient.invalidateQueries({ queryKey: ['faculties'] })
      },
      onError(error, variables, context) {
        toast.error(error.message)
      },
      onSettled(data, error, variables, context) {
        onDismiss(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onDismiss}>
      <DialogContent className="max-w-sm">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Add New Faculty
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Please enter the faculty details below to add a new faculty
              member.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...addFacultyForm}>
          <form
            id="add-faculty-form"
            className="space-y-5"
            onSubmit={addFacultyForm.handleSubmit(onSubmit)}
          >
            <FormField
              name="name"
              control={addFacultyForm.control}
              render={({ field }) => (
                <FormItem className="*:not-first:mt-2">
                  <FormLabel>Faculty Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter faculty name"
                      disabled={isCreateFacultyMutating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={isCreateFacultyMutating}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="flex-1"
                form="add-faculty-form"
                loading={isCreateFacultyMutating}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFaculty
