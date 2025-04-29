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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import {
  EditMagazineFormValues,
  editMagazineSchema,
} from '@/features/magazine/utils/validator'

export default function EditMagazine() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<EditMagazineFormValues>({
    resolver: zodResolver(editMagazineSchema),
    defaultValues: {
      id: 0,
      title: '',
      openDate: new Date(),
      closeDate: new Date(),
      finalClosureDate: new Date(),
    },
  })

  useEffect(() => {
    async function fetchMagazine() {
      setIsLoading(true)
      try {
        const megazineId = params.megazineId as string
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/magazines/${megazineId}`);
        // const magazineData = await response.json();

        // Using demo data for now
        const magazineData = {
          id: Number(megazineId),
          title: 'Spring Magazine 2025',
          openDate: '2025-03-01T00:00:00Z',
          closeDate: '2025-04-15T00:00:00Z',
          finalCloseDate: '2025-04-30T00:00:00Z',
          published: true,
        }

        form.reset({
          title: magazineData.title,
          openDate: new Date(magazineData.openDate),
          closeDate: new Date(magazineData.closeDate),
          finalClosureDate: new Date(magazineData.finalCloseDate),
        })
      } catch (error) {
        console.error('Error fetching magazine:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.megazineId) {
      fetchMagazine()
    }
  }, [params.megazineId, form])

  const onSubmit = async (values: EditMagazineFormValues) => {
    try {
      // TODO: Implement update magazine API call
      // const response = await fetch(`/api/magazines/${params.megazineId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values)
      // });

      console.log('Updating magazine:', values)
      router.push('/magazines')
    } catch (error) {
      console.error('Error updating magazine:', error)
    }
  }

  return (
    <div className="container mx-auto flex flex-col gap-y-5 pb-10 pt-5">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-2xl font-bold tracking-tight">Edit Magazine</h2>
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
              name="openDate"
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
                        onSelect={field.onChange}
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
              name="closeDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Close Date</FormLabel>
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
                        disabled={(date) => date <= form.getValues('openDate')}
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
              name="finalClosureDate"
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
                        disabled={(date) => date < form.getValues('closeDate')}
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
