'use client'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useDeleteUser, useGetUser } from '@/features/users/api/users'
import {
  Calendar,
  ChevronLeft,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Mail,
  PaperclipIcon,
  PencilLine,
  Phone,
  Trash2,
  User,
  UserCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { mockContributions } from '../../utils/data'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useQueryClient } from '@tanstack/react-query'

const StudentDetail = () => {
  const session = useSession()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const router = useRouter()
  const queryClient = useQueryClient()
  const accessToken = session.data?.user.token as string
  const params = useParams<{ studentId: string }>()

  const { mutate: deleteUserMutate, isPending: isDeleteUserMutating } =
    useDeleteUser(accessToken)

  const { isSuccess, error, data, isLoading } = useGetUser(
    accessToken,
    Number(params.studentId),
    !!accessToken
  )

  const handleDeleteOpen = (open: boolean) => {
    if (!isDeleteUserMutating) {
      setIsDeleteOpen(open)
    }
  }

  const handleDeleteUser = async () => {
    deleteUserMutate(Number(params.studentId), {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['users', 'role', 'student'],
        })
        router.push('/students')
      },
      onSettled() {
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
      <div className="container mx-auto flex flex-col gap-y-5 px-4 py-6 pt-5 sm:px-6 lg:px-8">
        <Button
          variant="secondary"
          size="sm"
          className="mb-2 w-fit"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="border-input/75 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-semibold text-secondary-foreground sm:text-xl">
                Student #{params.studentId}
                <Badge
                  className="rounded-md border-none ring-0"
                  variant={user.status ? 'success' : 'destructive'}
                >
                  {user.status ? 'Active' : 'Inactive'}
                </Badge>
              </h3>
              <p className="mt-1 max-w-2xl text-sm/6 text-muted-foreground">
                Personal details and academic contributions
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2 sm:ml-4 sm:mt-0">
            <Button
              variant="destructive"
              className="gap-2"
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

            <Link href={`/students/${params.studentId}/edit`}>
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
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-secondary-foreground">
                <User className="h-4 w-4" />
                Username
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.user_name}
              </dd>
            </div>

            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-secondary-foreground">
                <UserCircle className="h-4 w-4" />
                First Name
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.first_name}
              </dd>
            </div>

            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-secondary-foreground">
                <UserCircle className="h-4 w-4" />
                Last Name
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.last_name}
              </dd>
            </div>

            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-secondary-foreground">
                <Mail className="h-4 w-4" />
                Email address
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.email}
              </dd>
            </div>

            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-secondary-foreground">
                <Phone className="h-4 w-4" />
                Phone
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.phone ? user.phone : 'N/A'}
              </dd>
            </div>

            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-secondary-foreground">
                <GraduationCap className="h-4 w-4" />
                Faculty
              </dt>
              <dd className="mt-1 text-sm/6 text-secondary-foreground/75 sm:col-span-3 sm:mt-0">
                {user.StudentFaculty?.faculty?.name ?? 'N/A'}
              </dd>
            </div>

            <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
              <div>
                <dt className="flex items-center gap-2 text-sm/6 font-medium text-secondary-foreground">
                  <FileText className="h-4 w-4" />
                  Contributions
                </dt>
              </div>

              <dd className="mt-2 text-sm text-secondary-foreground sm:col-span-3 sm:mt-0">
                {mockContributions.length > 0 ? (
                  <ul className="divide-y divide-input/75 rounded-md border border-input/75">
                    {mockContributions.map((contribution) => (
                      <div
                        key={contribution.id}
                        className="py-4 pl-4 pr-5 text-sm/6"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <PaperclipIcon className="size-4 text-muted-foreground" />
                              <h3 className="font-medium text-secondary-foreground">
                                {contribution.name}
                              </h3>
                            </div>

                            <p className="ml-7 mt-1 text-sm text-muted-foreground">
                              {contribution.fileName}
                            </p>

                            <div className="ml-7 mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground/80">
                              <span className="flex items-center">
                                <Eye className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                                {contribution.viewCount} views
                              </span>
                              <span className="flex items-center">
                                <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                                {contribution.academicYear}
                              </span>
                              <span>{contribution.fileSize}</span>
                            </div>
                          </div>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="outline">
                                <Download className="size-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="font-semibold">
                              Download
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-lg border border-muted p-6 text-center">
                    <p className="text-muted-foreground/80">
                      No contributions found.
                    </p>
                  </div>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }

  return null
}

export default StudentDetail
