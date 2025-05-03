'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { columns } from './brower-usage-columns'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/ui/data-table'
import { useGetBrowserUsages } from '@/features/dashboard/api/dashboard'

const BrowserUsage = () => {
  const session = useSession()
  const accessToken = session?.data?.user.token as string
  const { data, isPending, error, isSuccess } = useGetBrowserUsages(
    accessToken,
    !!accessToken
  )
  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-[150px] lg:w-[250px]" />
            <Skeleton className="h-9 w-12" />
          </div>
          <div className="divide-y rounded-lg border">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div>Error fetching browser usage data: {error.message}</div>
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="gap-1">
          <h2 className="text-lg font-bold">Browser Usages</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Analysis of browser usage across our platform
          </p>
        </div>
        <DataTable columns={columns} data={data.browserUsages} />
      </div>
    )
  }

  return null
}

export default BrowserUsage
