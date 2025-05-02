'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
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
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Textarea } from '@/components/ui/textarea'
import { useRouter, useParams } from 'next/navigation'

import {
  editMagazineSchema,
  EditMagazineFormValues,
} from '@/features/magazine/utils/validator'
import { useGetMagazine } from '@/features/magazine/api/megazine'

export default function EditMagazine() {
  const router = useRouter()

  const session = useSession()
  const { magazineId } = useParams<{ magazineId: string }>()
  const accessToken = session?.data?.user.token as string

  const { data, isPending, error, isSuccess } = useGetMagazine(
    accessToken,
    parseInt(magazineId),
    !!accessToken
  )

  const form = useForm<z.infer<typeof editMagazineSchema>>({
    resolver: zodResolver(editMagazineSchema),
    defaultValues: {
      event_id: Number(magazineId),
      title: '',
      description: '',
      createdBy: 0,
      entry_closure: new Date(),
      final_closure: new Date(),
    },
  })

  useEffect(() => {
    if (isSuccess && data?.result) {
      form.reset({
        event_id: data.result.event_id,
        title: data.result.title,
        description: data.result.description,
        createdBy: data.result.User.user_id,
        entry_closure: new Date(data.result.closure.entry_closure),
        final_closure: new Date(data.result.closure.final_closure),
      })
    }
  }, [isSuccess, data])

  const onSubmit = async (values: EditMagazineFormValues) => {}

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto flex flex-col gap-y-5 pb-10 pt-5">
        <div className="mx-auto flex w-full max-w-md flex-col gap-5">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-2xl font-bold tracking-tight">
                Edit Magazine
              </h2>
              <p className="text-muted-foreground">
                Update magazine details and submission dates
              </p>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter magazine title"
                        className="min-h-[80px] resize-none"
                        {...field}
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
                        placeholder="Enter magazine description"
                        className="min-h-[80px] resize-none"
                        {...field}
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
                    <FormLabel>Open Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
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
                          disabled={(date) => date < new Date()}
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
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
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
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            date <= form.getValues('entry_closure')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/magazines')}
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
  }

  return null
}
