'use client'
import React, { useState } from 'react'
import { User } from '@/features/users/types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteUser } from '@/features/users/api/users'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'

const RowActions: React.FC<{ row: User }> = ({ row }) => {
  const session = useSession()
  const queryClient = useQueryClient()
  const accessToken = session?.data?.user?.token as string

  const { mutate: deleteUserMutate, isPending: isDeleteUserMutating } =
    useDeleteUser(accessToken)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleDeleteOpen = (open: boolean) => {
    if (!isDeleteUserMutating) {
      setIsDeleteOpen(open)
    }
  }

  const handleDeleteUser = () => {
    deleteUserMutate(Number(row.user_id), {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['users', 'role', 'guest'],
        })
      },
      onSettled() {
        handleDeleteOpen(false)
      },
    })
  }

  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDeleteOpen(true)}
          >
            <Trash2 strokeWidth={1.2} className="size-5 text-red-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
          Delete
        </TooltipContent>
      </Tooltip>

      <AlertDialog open={isDeleteOpen} onOpenChange={handleDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteUserMutating}>
              Cancel
            </AlertDialogCancel>
            <Button loading={isDeleteUserMutating} onClick={handleDeleteUser}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default RowActions
