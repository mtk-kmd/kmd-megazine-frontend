import dayjs from 'dayjs'
import { zipSync } from 'fflate'
import React, { useState } from 'react'
import { Contribution } from '../../types'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const DownloadAction = ({ row }: { row: Contribution }) => {
  const [isLoading, setIsLoading] = useState(false)
  const uploadUrls = (row.uploadUrl as string[]) || []

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
      a.download = `${row.student_id}-${row.student.user_name.replace(/\s+/g, '')}-${dayjs().format('YYYY-MM-DD')}-contribution.zip`
      a.click()
      URL.revokeObjectURL(downloadUrl)

      toast.success('Your files have been successfully downloaded.')
    } catch (error) {
      toast.error('Failed to download files. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex space-x-2 whitespace-nowrap">
      {uploadUrls.length > 0 ? (
        <Button
          size="sm"
          loading={isLoading}
          variant="outline"
          onClick={downloadUrlsAsZip}
          className="gap-2 whitespace-nowrap"
        >
          {!isLoading && <Download className="size-4" />}
          {uploadUrls.length === 1 ? '1 File' : `${uploadUrls.length} Files`}
        </Button>
      ) : (
        <Badge variant="secondary" className="whitespace-nowrap">
          No Files
        </Badge>
      )}
    </div>
  )
}

export default DownloadAction
