'use client'
import React from 'react'
import { columns } from './columns'
import { useSession } from 'next-auth/react'
import { DataTable } from '@/components/ui/data-table'
import { useGetStudents } from '@/features/users/api/student'
import Header from './header'

const StudentList = () => {
  const session = useSession()
  const accessToken = session.data?.user.token

  const { isLoading, data, error, isSuccess } = useGetStudents(
    accessToken as string,
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
      <div className="container mx-auto flex flex-col gap-y-5 pb-10">
        <Header />
        <DataTable
          data={data}
          columns={columns}
          searchLabel="Search by name or email"
        />
      </div>
    )
  }

  return null
}

export default StudentList
