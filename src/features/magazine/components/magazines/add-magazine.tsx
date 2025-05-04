'use client'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import {
  addMagazineSchema,
  AddMagazineFormValues,
} from '@/features/magazine/utils/validator'
import { useSession } from 'next-auth/react'
import { Textarea } from '@/components/ui/textarea'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateMagazine } from '../../api/megazine'

const initialFormValues: AddMagazineFormValues = {
  title: '',
  createdBy: 0,
  description: '',
  entry_closure: dayjs().add(1, 'day').toDate(),
  final_closure: dayjs().add(2, 'days').toDate(),
}

interface AddMagazineProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMagazine({ open, onOpenChange }: AddMagazineProps) {
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session.data?.user.token as string
  const userId = session.data?.user.data.user_id as number

  const { mutate, isPending } = useCreateMagazine(accessToken)
  const form = useForm<AddMagazineFormValues>({
    resolver: zodResolver(addMagazineSchema),
    defaultValues: { ...initialFormValues, createdBy: userId },
  })

  const onDismiss = (open: boolean) => {
    onOpenChange(open)
    form.reset({ ...initialFormValues, createdBy: userId })
  }

  const onSubmit = async (values: AddMagazineFormValues) => {
    mutate(values, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['magazines'] })
        onDismiss(false)
      },
    })
  }

  return (
    <Drawer open={open} onOpenChange={onDismiss}>
      <DrawerContent className="flex h-full max-h-[calc(100dvh-0.75rem)] flex-col">
        <DrawerHeader className="mx-auto w-full max-w-md">
          <DrawerTitle>Add New Magazine</DrawerTitle>
          <DrawerDescription>
            Create a new magazine with submission dates
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            id="add-magazine-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto"
          >
            <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-5 p-4 pt-0">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Enter magazine title"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px] resize-none"
                        placeholder="Enter magazine description"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entry_closure"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Entry Closure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'h-10 w-full pl-3 pr-2.5 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={isPending}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date)
                            }
                          }}
                          disabled={(date) => date < new Date() || isPending}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="final_closure"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Final Closure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'h-10 w-full pl-3 pr-2.5 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={isPending}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date)
                            }
                          }}
                          disabled={(date) =>
                            date < new Date() ||
                            date <= form.getValues('entry_closure') ||
                            isPending
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DrawerFooter className="mx-auto flex w-full max-w-md flex-col gap-3 lg:flex-row">
          <DrawerClose disabled={isPending} asChild>
            <Button
              className="lg:flex-1"
              variant="outline"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            loading={isPending}
            type="submit"
            className="lg:flex-1"
            form="add-magazine-form"
          >
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
