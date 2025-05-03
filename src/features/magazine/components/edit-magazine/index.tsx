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
import { CalendarIcon, ChevronLeft } from 'lucide-react'
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
import {
  useGetMagazine,
  useUpdateMagazine,
} from '@/features/magazine/api/megazine'
import { useQueryClient } from '@tanstack/react-query'

export default function EditMagazine() {
  const router = useRouter()

  const session = useSession()
  const { magazineId } = useParams<{ magazineId: string }>()
  const accessToken = session?.data?.user.token as string

  const queryClient = useQueryClient()
  const { data, isPending, error, isSuccess } = useGetMagazine(
    accessToken,
    parseInt(magazineId),
    !!accessToken
  )

  const { mutate: updateMagazine, isPending: isUpdateMagazinePending } =
    useUpdateMagazine(accessToken)

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

  const onSubmit = async (values: EditMagazineFormValues) => {
    updateMagazine(values, {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['magazine', parseInt(magazineId)],
        })
      },
    })
  }

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto flex flex-col gap-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => router.push('/magazines')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-lg font-bold tracking-tight text-primary">
                Edit Magazine
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Update magazine details and submission dates
              </p>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        disabled={isUpdateMagazinePending}
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
                        className="min-h-[120px] resize-none"
                        {...field}
                        disabled={isUpdateMagazinePending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="entry_closure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Open Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'h-10 w-full pl-3 pr-2.5 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                              disabled={isUpdateMagazinePending}
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
                    <FormItem>
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
                              disabled={isUpdateMagazinePending}
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
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/magazines')}
                  disabled={isUpdateMagazinePending}
                >
                  Cancel
                </Button>
                <Button loading={isUpdateMagazinePending} type="submit">
                  Update Magazine
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
  }

  return null
}
