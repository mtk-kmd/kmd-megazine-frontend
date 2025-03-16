import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PencilLine, Trash2, View } from 'lucide-react'
import { UserWithOptionalFaculty } from '@/features/users/types'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const RowActions: React.FC<{ row: UserWithOptionalFaculty }> = ({ row }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleDeleteOpen = (open: boolean) => {
    setIsDeleteOpen(open)
  }

  const handleDeleteUser = async () => {}

  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <View strokeWidth={1.2} className="font size-5 text-green-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
          View
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/students/${row.user_id}/edit`}>
            <Button variant="ghost" size="icon">
              <PencilLine strokeWidth={1.2} className="size-5 text-blue-600" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
          Edit
        </TooltipContent>
      </Tooltip>

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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleDeleteUser}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default RowActions
