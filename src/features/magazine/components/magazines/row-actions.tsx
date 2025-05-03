import { MoreVertical, PencilLine, Trash2, Upload, View } from 'lucide-react'
import { Event } from '@/features/magazine/types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useSession } from 'next-auth/react'
import { useDeleteMagazine } from '../../api/megazine'

interface RowActionsProps {
  row: Event
}

const RowActions = ({ row }: RowActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const session = useSession()
  const accessToken = session?.data?.user.token as string

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

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/magazines/${row.event_id}`}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <View strokeWidth={1.2} className="font size-5 text-green-600" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg px-4 py-3 text-sm font-bold">
          View
        </TooltipContent>
      </Tooltip>

      {row.status !== 'FINALIZED' && (
        <>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl" align="end">
              <Link
                href={`/magazines/${row.event_id}/edit`}
                onClick={() => setIsDropdownOpen(false)}
              >
                <DropdownMenuItem className="rounded-lg px-4 py-2.5 text-sm font-semibold">
                  <PencilLine strokeWidth={1.2} className="mr-2 size-5" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-destructive focus:text-destructive"
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
      )}
    </div>
  )
}

export default RowActions
