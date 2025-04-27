'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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
import { Input } from '@/components/ui/input'
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
} from '@/features/megazine/utils/validator'

const initialFormValues: AddMagazineFormValues = {
  title: '',
  openDate: new Date(),
  closeDate: new Date(),
  finalClosureDate: new Date(),
}

interface AddMagazineProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMagazine({ open, onOpenChange }: AddMagazineProps) {
  const form = useForm<AddMagazineFormValues>({
    resolver: zodResolver(addMagazineSchema),
    defaultValues: initialFormValues,
  })

  const onSubmit = async (values: AddMagazineFormValues) => {
    onOpenChange(false)
    form.reset()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
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
                      <Input placeholder="Enter magazine title" {...field} />
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
                          disabled={(date) =>
                            date <= form.getValues('openDate')
                          }
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
                          disabled={(date) =>
                            date < form.getValues('closeDate')
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
          <DrawerClose asChild>
            <Button className="lg:flex-1" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <Button type="submit" className="lg:flex-1" form="add-magazine-form">
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
