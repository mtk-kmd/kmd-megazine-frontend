'use client'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { useGetUser } from '@/features/users/api/users'

const AdminDetail = () => {
  const session = useSession()
  const router = useRouter()

  const accessToken = session.data?.user.token as string
  const params = useParams<{ adminId: string }>()

  const { isSuccess, error, data, isLoading } = useGetUser(
    accessToken,
    Number(params.adminId),
    !!accessToken
  )

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>{error.message}</span>
  }

  if (isSuccess) {
    const user = data.result

    return (
      <div className="container mx-auto flex flex-col gap-y-5 px-4 py-6 pt-5 sm:px-6 lg:px-8">
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => router.push('/managers')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="border-input/75 sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-2xl font-semibold text-secondary-foreground sm:text-xl">
              Admin #{params.adminId}
              <Badge
                className="rounded-md border-none ring-0"
                variant={user.status ? 'success' : 'destructive'}
              >
                {user.status ? 'Active' : 'Inactive'}
              </Badge>
            </h3>
            <p className="mt-1 max-w-2xl text-sm/6 text-muted-foreground">
              Personal details of the admin
            </p>
          </div>
        </div>
        <div className="border-t border-input/75">
          <dl className="divide-y divide-input/75">
            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm/6 font-medium text-secondary-foreground">
                Username
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.user_name}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm/6 font-medium text-secondary-foreground">
                First Name
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.first_name}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm/6 font-medium text-secondary-foreground">
                Last Name
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.last_name}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm/6 font-medium text-secondary-foreground">
                Email address
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.email}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm/6 font-medium text-secondary-foreground">
                Phone
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.phone ? user.phone : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }

  return null
}

export default AdminDetail
