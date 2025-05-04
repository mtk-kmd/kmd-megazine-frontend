import dayjs from 'dayjs'

import { Contribution } from '../../types'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Calendar,
  Download,
  FileText,
  MessageSquare,
  Paperclip,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { zipSync } from 'fflate'
import { toast } from 'sonner'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface ContributionContentProps {
  contribution: Contribution
}

export function ContributionContent({
  contribution,
}: ContributionContentProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const getStatusVariant = () => {
    return contribution.submission_status === 'PENDING'
      ? 'warning'
      : contribution.submission_status === 'ACCEPTED'
        ? 'success'
        : contribution.submission_status === 'REJECTED'
          ? 'destructive'
          : 'default'
  }

  const uploadUrls = contribution.uploadUrl || []

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
      console.log(error)
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
    <Card className="shadow-none">
      <CardHeader className="space-y-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{contribution.title}</CardTitle>
          <Badge
            variant={getStatusVariant()}
            className="px-3 py-1 text-xs font-medium"
          >
            {contribution.submission_status}
          </Badge>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="/profile-placeholder.png"
                alt={`${contribution.student.first_name} ${contribution.student.last_name}`}
              />
              <AvatarFallback>
                {getInitials(
                  contribution.student.first_name,
                  contribution.student.last_name
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {contribution.student.first_name}{' '}
                {contribution.student.last_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {contribution.student.StudentFaculty?.faculty.name}
              </p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{dayjs(contribution.submittedAt).format('MMM D, YYYY')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span>{contribution.comments.length} comments</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea>
          <div className="max-h-[300px] p-6">
            <p className="whitespace-pre-wrap leading-relaxed text-foreground">
              {contribution.content}
            </p>
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-6">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Attachments</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Paperclip className="h-4 w-4" />
                <span>{contribution.uploadUrl.length} files</span>
              </div>
              <Separator orientation="vertical" className="h-5" />
              <Button
                size="sm"
                variant="outline"
                loading={isLoading}
                onClick={downloadUrlsAsZip}
              >
                {!isLoading && <Download className="mr-2 h-4 w-4" />}
                Download All
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contribution.uploadUrl.map((url, index) => {
              const fileName = decodeURIComponent(
                url.split('/').pop()?.split('?')[0] || ''
              )
                .split('-')
                .slice(1)
                .join('-')

              const fileExtension = fileName.split('.').pop()?.toUpperCase()

              return (
                <div
                  key={index}
                  className="group flex flex-col items-start gap-3 rounded-xl border bg-background p-4"
                >
                  <div className="flex w-full items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary/20">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-foreground">
                        {fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {fileExtension} Document
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadFile(url)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
