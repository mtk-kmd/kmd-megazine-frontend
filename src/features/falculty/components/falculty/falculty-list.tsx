'use client'
import React from 'react'

import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useGetFalculties } from '@/features/falculty/api/falculty'
import { useSession } from 'next-auth/react'

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
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  if (isSuccess) {
    return (
      <DataTable data={data} columns={columns} searchLabel="Search by name" />
    )
  }

  return null
}

export default FalcultyList
