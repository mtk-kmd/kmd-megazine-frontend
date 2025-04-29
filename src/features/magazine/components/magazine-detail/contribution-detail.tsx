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

import { format } from 'date-fns'
import {
  Download,
  FileText,
  MessageSquare,
  X,
  Image as LucideImage,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import Image from 'next/image'
import { Contribution } from '../../types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

interface ContributiionDetailProps {
  contribution?: Contribution
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getSubmissionStateBadgeVariant = (state: Contribution['state']) => {
  switch (state) {
    case 'submitted':
      return 'info'
    case 'underReview':
      return 'warning'
    case 'selected':
      return 'success'
    case 'rejected':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const ContributionDetail = ({
  contribution,
  open,
  onOpenChange,
}: ContributiionDetailProps) => {
  if (!contribution) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex h-full max-h-[calc(100dvh-0.75rem)] flex-col">
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
          <DrawerHeader className="px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <DrawerTitle className="text-left text-xl">
                  {contribution.title}
                </DrawerTitle>
                <DrawerDescription>
                  Submitted on{' '}
                  {format(new Date(contribution.submittedDate), 'PPP')}
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <X className="size-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <Tabs
            defaultValue="details"
            className="flex w-full flex-1 flex-col overflow-hidden"
          >
            <div className="px-4 sm:px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="details"
                  className="flex items-center gap-1.5"
                >
                  <FileText className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  disabled={!contribution.images?.length}
                  className="flex items-center gap-1.5"
                >
                  <LucideImage className="h-4 w-4" />
                  Images
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  disabled={!contribution.comments.length}
                  className="flex items-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="mt-4 flex-1 px-4 sm:px-6">
              <TabsContent value="details" className="space-y-6 pb-4">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Contribution Information
                    </h3>
                    <Badge
                      variant={getSubmissionStateBadgeVariant(
                        contribution.state
                      )}
                      className="px-2.5 py-0.5 text-sm"
                    >
                      {contribution.state.charAt(0).toUpperCase() +
                        contribution.state.slice(1)}
                    </Badge>
                  </div>
                  <Card className="overflow-hidden shadow-none">
                    <CardContent className="p-0">
                      <div className="grid divide-y">
                        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-3">
                          <p className="text-sm font-medium text-muted-foreground">
                            Student
                          </p>
                          <div className="sm:col-span-2">
                            <p className="font-medium">
                              {contribution.student.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {contribution.student.email}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-3">
                          <p className="text-sm font-medium text-muted-foreground">
                            Faculty
                          </p>
                          <p className="font-medium sm:col-span-2">
                            {contribution.faculty.name}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-3">
                          <p className="text-sm font-medium text-muted-foreground">
                            Submitted
                          </p>
                          <p className="font-medium sm:col-span-2">
                            {format(
                              new Date(contribution.submittedDate),
                              'PPP'
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {contribution.articleFile && (
                    <Card className="shadow-none">
                      <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="truncate">
                          <p className="font-medium">
                            {contribution.articleFile.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Article document
                          </p>
                        </div>
                        <Button
                          size="sm"
                          asChild
                          variant="secondary"
                          className="mt-2 sm:mt-0"
                        >
                          <a
                            href={contribution.articleFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2"
                          >
                            <Download className="size-4" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-6 pb-4">
                {contribution.images && contribution.images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Images</h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                      {contribution.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-[4/3] overflow-hidden rounded-lg border"
                        >
                          <Image
                            src={image}
                            alt={`Contribution image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-6 pb-4">
                {contribution.comments.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Review Comments</h3>
                    <div className="space-y-3">
                      {contribution.comments.map((comment) => (
                        <div key={comment.id} className="rounded-lg border p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <MessageSquare className="h-4 w-4" />
                              </span>
                              <div>
                                <p className="font-medium">
                                  {comment.coordinator.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Coordinator
                                </p>
                              </div>
                            </div>
                            <time className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), 'PPP')}
                            </time>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DrawerFooter className="px-4 pb-8 pt-6 sm:px-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default ContributionDetail
