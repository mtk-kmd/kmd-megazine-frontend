'use client'
import Link from 'next/link'
import React, { useState } from 'react'

import { useSession } from 'next-auth/react'

import { PencilLine, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { useDeleteUser, useGetUser } from '@/features/users/api/users'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { Badge } from '@/components/ui/badge'
import { useQueryClient } from '@tanstack/react-query'

const ManagerDetail = () => {
  const session = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const accessToken = session.data?.user.token as string
  const params = useParams<{ managerId: string }>()

  const { isSuccess, error, data, isLoading } = useGetUser(
    accessToken,
    Number(params.managerId),
    !!accessToken
  )

  const { mutate: deleteUserMutate, isPending: isDeleteUserMutating } =
    useDeleteUser(accessToken)

  const handleDeleteOpen = (open: boolean) => {
    if (!isDeleteUserMutating) {
      setIsDeleteOpen(open)
    }
  }

  const handleDeleteUser = () => {
    deleteUserMutate(Number(params.managerId), {
      async onSuccess(data, variables, context) {
        await queryClient.invalidateQueries({
          queryKey: ['users', 'role', 'manager'],
        })
        router.push('/managers')
      },
      onSettled(data, error, variables, context) {
        handleDeleteOpen(false)
      },
    })
  }

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>{error.message}</span>
  }

  if (isSuccess) {
    const user = data.result

    return (
      <div className="container mx-auto flex flex-col gap-y-5 pb-10">
        <div className="border-input/75 sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-2xl font-semibold text-secondary-foreground sm:text-xl">
              Manager #{params.managerId}
              <Badge
                className="rounded-md border-none ring-0"
                variant={user.status ? 'success' : 'destructive'}
              >
                {user.status ? 'Active' : 'Inactive'}
              </Badge>
            </h3>
            <p className="mt-1 max-w-2xl text-sm/6 text-muted-foreground">
              Personal details of the manager
            </p>
          </div>
          <div className="mt-3 flex gap-2 sm:ml-4 sm:mt-0">
            <Button
              variant="destructive"
              onClick={() => handleDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>

            <AlertDialog open={isDeleteOpen} onOpenChange={handleDeleteOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the user and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleteUserMutating}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    loading={isDeleteUserMutating}
                    onClick={handleDeleteUser}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Link href={`/managers/${params.managerId}/edit`}>
              <Button>
                <PencilLine className="size-3.5" />
                Edit
              </Button>
            </Link>
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

export default ManagerDetail
