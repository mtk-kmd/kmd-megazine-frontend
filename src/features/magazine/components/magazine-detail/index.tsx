'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Card, CardContent } from '@/components/ui/card'

import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'

import dayjs from 'dayjs'
import { toast } from 'sonner'
import { useState } from 'react'
import { zipSync } from 'fflate'
import contributionColumns from './contribution-columns'
import { useGetMagazine } from '@/features/magazine/api/megazine'
import { Separator } from '@/components/ui/separator'

const MagazineDetail = () => {
  const session = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const { magazineId } = useParams<{ magazineId: string }>()
  const accessToken = session?.data?.user.token as string

  const { data, isPending, error, isSuccess } = useGetMagazine(
    accessToken,
    parseInt(magazineId),
    !!accessToken
  )

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isSuccess) {
    const { result: event } = data

    const downloadUrlsAsZip = async (uploadUrls: string[]) => {
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
        a.download = `Event-${event.event_id}-${event.title.replace(/\s+/g, '-')}-${dayjs().format('YYYY-MM-DD')}.zip`
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

    const acceptedUploadUrls = event.StudentSubmission.filter(
      (contribution) => contribution.submission_status === 'ACCEPTED'
    )
      .flatMap((contribution) => contribution.uploadUrl || [])
      .filter((url): url is string => typeof url === 'string')

    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/magazines">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="flex space-x-2">
              {data.result.status !== 'FINALIZED' && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/magazines/${data.result.event_id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </>
              )}
              {data.result.status === 'FINALIZED' && (
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="mb-4 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {data.result.title}
            </h2>

            <Card className="shadow-none">
              <CardContent className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-4">
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </h3>
                  <Badge
                    className="px-3 py-1 text-xs font-normal"
                    variant={
                      event.status === 'FINALIZED'
                        ? 'success'
                        : event.status === 'CLOSED'
                          ? 'warning'
                          : 'info'
                    }
                  >
                    <span className="first-letter:uppercase">
                      {event.status.toLowerCase()}
                    </span>
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                    Close Date
                  </h3>
                  <p className="text-sm">
                    {format(new Date(event.closure.entry_closure), 'PPP')}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                    Final Close Date
                  </h3>
                  <p className="text-sm">
                    {format(new Date(event.closure.final_closure), 'PPP')}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                    Created At
                  </h3>
                  <p className="text-sm">
                    {format(new Date(event.createdAt), 'PPP')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Contributions</h2>
            <div className="flex items-center space-x-4">
              <div className="text-muted-foreground">
                Total Selected files: {acceptedUploadUrls.length}
              </div>
              <Separator orientation="vertical" className="h-6" />
              <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => downloadUrlsAsZip(acceptedUploadUrls)}
              >
                {!isLoading && <Download className="mr-2 h-4 w-4" />}
                Download All
              </Button>
            </div>
          </div>
          <DataTable
            columns={contributionColumns}
            data={data.result.StudentSubmission}
          />
        </div>
      </div>
    )
  }
  return null
}

export default MagazineDetail
