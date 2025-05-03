'use client'
import React from 'react'

import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useGetFalculties } from '@/features/falculty/api/falculty'
import { useSession } from 'next-auth/react'
import { ErrorWidget } from '@/components/ui/error-widget'
import { Skeleton } from '@/components/ui/skeleton'

const FalcultyList = () => {
  const session = useSession()
  const accessToken = session.data?.user.token as string

  const {
    error,
    isSuccess,
    data = [],
    isFetching,
  } = useGetFalculties(accessToken, !!accessToken)

  if (isFetching) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-9 w-[250px]" />
          <Skeleton className="h-9 w-12" />
        </div>
        <div className="rounded-md border">
          <div className="h-12 border-b px-4" />
          <div className="flex flex-col">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="flex border-b last:border-b-0">
                {Array.from({ length: 4 }, (_, j) => (
                  <div key={j} className="flex-1 px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-[100px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorWidget
        type="error"
        title={error.name}
        description={error.message}
        className="rounded-xl border border-border"
      />
    )
  }

  if (isSuccess) {
    return (
      <DataTable data={data} columns={columns} searchLabel="Search by name" />
    )
  }

  return null
}

export default FalcultyList
