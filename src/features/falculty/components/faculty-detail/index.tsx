'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useGetFaculty } from '@/features/falculty/api/falculty'
import { GraduationCap, IdCard, User, Users } from 'lucide-react'

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
          <dl className="divide-y divide-border text-sm text-muted-foreground">
            <div className="grid grid-cols-1 py-4 sm:grid-cols-4 sm:gap-4">
              <dt className="flex items-center gap-2 font-medium text-secondary-foreground">
                <GraduationCap className="h-4 w-4" />
                Faculty Name
              </dt>
              <dd className="sm:col-span-3">{faculty.name}</dd>
            </div>
            <div className="grid grid-cols-1 py-4 sm:grid-cols-4 sm:gap-4">
              <dt className="flex items-center gap-2 font-medium text-secondary-foreground">
                <IdCard className="h-4 w-4" />
                Coordinator ID
              </dt>
              <dd className="sm:col-span-3">{faculty.coordinator_id}</dd>
            </div>
            <div className="grid grid-cols-1 py-4 sm:grid-cols-4 sm:gap-4">
              <dt className="flex items-center gap-2 font-medium text-secondary-foreground">
                <User className="h-4 w-4" />
                Coordinator Name
              </dt>
              <dd className="sm:col-span-3">
                {faculty.coordinator?.user_name}
              </dd>
            </div>
            <div className="grid grid-cols-1 py-4 sm:grid-cols-4 sm:gap-4">
              <dt className="flex items-center gap-2 font-medium text-secondary-foreground">
                <Users className="h-4 w-4" />
                Total Students
              </dt>
              <dd className="sm:col-span-3">{faculty.students.length || 0}</dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }

  return null
}

export default FacultyDetail
