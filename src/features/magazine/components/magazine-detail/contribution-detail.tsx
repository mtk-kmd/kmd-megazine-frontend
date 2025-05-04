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

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  FileText,
  MessageSquare,
  X,
  Image as LucideImage,
  Download,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Contribution } from '@/features/contribution/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { zipSync } from 'fflate'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { ErrorWidget } from '@/components/ui/error-widget'

interface ContributiionDetailProps {
  contribution?: Contribution
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getSubmissionStateBadgeVariant = (
  state: Contribution['submission_status']
) => {
  switch (state) {
    case 'ACCEPTED':
      return 'info'
    case 'PENDING':
      return 'warning'
    case 'REJECTED':
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
  const [isLoading, setIsLoading] = useState(false)
  const uploadUrls = (contribution?.uploadUrl as string[]) || []

  if (!contribution) return null

  const downloadUrlsAsZip = async () => {
    setIsLoading(true)
    try {
      const files: Record<string, Uint8Array> = {}

      await Promise.all(
        uploadUrls.map(async (url) => {
          if (!url) return

          const response = await fetch(url)
          if (!response.ok)
            throw new Error(`Failed to fetch ${url}: ${response.status}`)

          const arrayBuffer = await response.arrayBuffer()
          const fileName = decodeURIComponent(
            url.split('/').pop()?.split('?')[0] || ''
          )
            .split('-')
            .slice(1)
            .join('-')
          files[fileName] = new Uint8Array(arrayBuffer)
        })
      )

      if (Object.keys(files).length === 0)
        throw new Error('No valid files to download')

      const zipped = zipSync(files)
      const blob = new Blob([zipped], { type: 'application/zip' })
      const downloadUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `Contribution-${contribution.submission_id}-${contribution.student.user_name.replace(/\s+/g, '')}-${dayjs().format('YYYY-MM-DD')}.zip`
      a.click()
      URL.revokeObjectURL(downloadUrl)

      toast.success('Your files have been successfully downloaded.')
    } catch (error) {
      toast.error('Failed to download files. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadFile = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok)
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)

      const blob = await response.blob()
      const fileName = url.split('/').pop()?.split('?')[0] || ''
      const decodedFileName = decodeURIComponent(fileName)
        .split('-')
        .slice(1)
        .join('-')

      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = decodedFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)
      toast.success('File downloaded successfully')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Download failed. Please try again.')
    }
  }

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
                  {format(new Date(contribution.submittedAt), 'PPP')}
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
                  className="flex items-center gap-1.5"
                >
                  <LucideImage className="h-4 w-4" />
                  Images
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
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
                        contribution.submission_status
                      )}
                      className="px-2.5 py-0.5 text-sm"
                    >
                      {contribution.submission_status.charAt(0).toUpperCase() +
                        contribution.submission_status.slice(1)}
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
                              {contribution.student.user_name}
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
                            {contribution.student.StudentFaculty?.faculty.name}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-3">
                          <p className="text-sm font-medium text-muted-foreground">
                            Submitted at
                          </p>
                          <p className="font-medium sm:col-span-2">
                            {format(new Date(contribution.submittedAt), 'PPP')}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-3">
                          <p className="text-sm font-medium text-muted-foreground">
                            Attachments
                          </p>
                          <div className="flex items-center justify-between sm:col-span-2">
                            <p className="font-medium">
                              {contribution.uploadUrl?.length || 0}{' '}
                              {contribution.uploadUrl?.length === 1
                                ? 'File'
                                : 'Files'}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              loading={isLoading}
                              onClick={downloadUrlsAsZip}
                              disabled={!contribution.uploadUrl?.length}
                              className="ml-4"
                            >
                              {!isLoading && (
                                <Download className="mr-2 h-4 w-4" />
                              )}
                              Download All
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {contribution.uploadUrl
                    .filter((url) => {
                      const fileName = decodeURIComponent(
                        url.split('/').pop()?.split('?')[0] || ''
                      )
                        .split('-')
                        .slice(1)
                        .join('-')
                      const fileExtension = fileName
                        .split('.')
                        .pop()
                        ?.toLowerCase()
                      return fileExtension === 'doc' || fileExtension === 'docx'
                    })
                    .map((url, index) => {
                      const fileName = decodeURIComponent(
                        url.split('/').pop()?.split('?')[0] || ''
                      )
                        .split('-')
                        .slice(1)
                        .join('-')

                      const fileExtension = fileName
                        .split('.')
                        .pop()
                        ?.toUpperCase()

                      return (
                        <Card
                          key={index}
                          className="shadow-none transition-colors hover:bg-accent/50"
                        >
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                              <div>
                                <p className="max-w-[200px] truncate font-medium">
                                  {fileName}
                                </p>
                                <Badge variant="secondary" className="mt-1">
                                  {fileExtension}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              onClick={() => downloadFile(url)}
                              size="sm"
                              variant="outline"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-6 pb-4">
                {contribution.uploadUrl
                  .filter((url) => {
                    const fileName = url.split('/').pop()?.split('?')[0] || ''
                    const fileExtension = fileName
                      .split('.')
                      .pop()
                      ?.toLowerCase()
                    return ['jpg', 'jpeg', 'png', 'gif'].includes(
                      fileExtension || ''
                    )
                  })
                  .map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] overflow-hidden rounded-lg border"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Contribution image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="comments" className="space-y-6 pb-4">
                {contribution.comments.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Review Comments</h3>
                    <div className="space-y-3">
                      {contribution.comments.map((comment) => (
                        <div
                          key={comment.comment_id}
                          className="rounded-lg border p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <MessageSquare className="h-4 w-4" />
                              </span>
                              <div>
                                <p className="font-medium">
                                  {comment.contributor.user_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {comment.contributor.role?.role_name}
                                </p>
                              </div>
                            </div>
                            <time className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), 'PPP')}
                            </time>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ErrorWidget
                    type="no-data"
                    title="No Comments"
                    description="There are no comments for this contribution yet."
                  />
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
