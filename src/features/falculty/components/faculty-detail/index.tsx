'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useGetFaculty } from '@/features/falculty/api/falculty'

const FacultyDetail = () => {
  const session = useSession()

  const accessToken = session.data?.user.token as string
  const params = useParams<{ facultyId: string }>()

  const { isSuccess, error, data, isLoading } = useGetFaculty(
    accessToken,
    Number(params.facultyId),
    !!accessToken
  )

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>{error.message}</span>
  }

  if (isSuccess) {
    const faculty = data.result

    return (
      <div className="container mx-auto flex flex-col gap-y-5 pb-10">
        <div className="border-input/75 sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-2xl font-semibold text-secondary-foreground sm:text-xl">
              Faculty #{params.facultyId}
            </h3>
            <p className="mt-1 max-w-2xl text-sm/6 text-muted-foreground">
              Detailed information of the faculty
            </p>
          </div>
        </div>
        <div className="border-t border-input/75">
          <dl className="divide-y divide-input/75">
            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm/6 font-medium text-secondary-foreground">
                Faculty Name
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {faculty.name}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm/6 font-medium text-secondary-foreground">
                Coordinator ID
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {faculty.coordinator_id}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm/6 font-medium text-secondary-foreground">
                Coordinator Name
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {faculty.coordinator?.user_name}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm/6 font-medium text-secondary-foreground">
                Total Students
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {faculty.students.length || 0}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }

  return null
}

export default FacultyDetail
