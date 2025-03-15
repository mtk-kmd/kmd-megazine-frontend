'use client'
import React from 'react'
import { columns } from './columns'
import { useSession } from 'next-auth/react'
import { DataTable } from '@/components/ui/data-table'
import { useGetUsers } from '@/features/users/api/users'

const StudentList = () => {
  const session = useSession()
  const accessToken = session.data?.user.token

  const { isLoading, data, error, isSuccess } = useGetUsers(
    accessToken as string,
    'student',
    !!accessToken
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  if (isSuccess) {
    return (
      <DataTable
        data={data}
        columns={columns}
        searchLabel="Search by name or email"
      />
    )
  }

  return null
}

export default StudentList
