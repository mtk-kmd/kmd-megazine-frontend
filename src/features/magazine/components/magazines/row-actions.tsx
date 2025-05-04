import {
  FileText,
  MoreVertical,
  PencilLine,
  Trash2,
  Upload,
  View,
} from 'lucide-react'
import { Event } from '@/features/magazine/types'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { ROLE_NAME } from '@/utils/constants'
import { useSession } from 'next-auth/react'
import { useDeleteMagazine } from '../../api/megazine'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface RowActionsProps {
  row: Event
}

const RowActions = ({ row }: RowActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const session = useSession()
  const accessToken = session?.data?.user.token as string
  const role_id = session?.data?.user.data.role_id as keyof typeof ROLE_NAME

  const role = ROLE_NAME[role_id]

  const { mutate: deleteMagazineMutate, isPending: isDeleteMagazineLoading } =
    useDeleteMagazine(accessToken)

  const handleDelete = () => {
    setIsDropdownOpen(false)
    setIsDeleteOpen(true)
  }

  const handleDeleteOpen = (open: boolean) => {
    if (!isDeleteMagazineLoading) {
      setIsDeleteOpen(open)
    }
  }

  const confirmDelete = () => {
    deleteMagazineMutate(row.event_id, {
      onSettled(data, error, variables, context) {
        handleDeleteOpen(false)
      },
    })
  }

  if (role === 'student') {
    const currentDate = new Date()
    const finalClosureDate = new Date(row.closure.final_closure)

    if (currentDate > finalClosureDate) {
      return (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-2 text-destructive"
              >
                <FileText className="h-4 w-4" />
                <span>Overdue</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px]">
              You can no longer contribute to this magazine as the deadline has
              passed.
            </TooltipContent>
          </Tooltip>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/magazines/${row.event_id}/add-contribution`}>
            <Button size="sm" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Submit</span>
            </Button>
          </Link>
        </div>
      )
    }
  }

  return (
    <div className="flex items-center gap-2">
      <>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl" align="end">
            <Link
              href={`/magazines/${row.event_id}`}
              onClick={() => setIsDropdownOpen(false)}
            >
              <DropdownMenuItem className="rounded-lg px-4 py-2.5 text-sm font-semibold [&>svg]:size-5">
                <View strokeWidth={1.2} className="mr-2 size-5" />
                <span>View</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />

            <Link
              href={`/magazines/${row.event_id}/edit`}
              onClick={() => setIsDropdownOpen(false)}
            >
              <DropdownMenuItem className="rounded-lg px-4 py-2.5 text-sm font-semibold [&>svg]:size-5">
                <PencilLine strokeWidth={1.2} className="mr-2 size-5" />
                <span>Edit</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-destructive focus:text-destructive [&>svg]:size-5"
            >
              <Trash2 strokeWidth={1.2} className="mr-2 size-5" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={isDeleteOpen} onOpenChange={handleDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                magazine.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleteMagazineLoading}>
                Cancel
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                loading={isDeleteMagazineLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    </div>
  )
}

export default RowActions
