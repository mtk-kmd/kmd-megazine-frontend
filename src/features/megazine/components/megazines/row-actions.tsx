import { MoreVertical, PencilLine, Trash2, Upload, View } from 'lucide-react'
import { Magazine } from '@/features/megazine/types'
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

interface RowActionsProps {
  row: Magazine
}

const RowActions = ({ row }: RowActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isPublishOpen, setIsPublishOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleDelete = () => {
    setIsDropdownOpen(false)
    setIsDeleteOpen(true)
  }

  const handlePublish = () => {
    setIsDropdownOpen(false)
    setIsPublishOpen(true)
  }

  const confirmDelete = () => {
    console.log('Delete magazine:', row.id)
    setIsDeleteOpen(false)
  }

  const confirmPublish = () => {
    console.log('Publish magazine:', row.id)
    setIsPublishOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/magazines/${row.id}`}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <View strokeWidth={1.2} className="font size-5 text-green-600" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg px-3 py-2 font-bold">
          View
        </TooltipContent>
      </Tooltip>

      {!row.published && (
        <>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl" align="end">
              <DropdownMenuItem
                className="rounded-lg px-3 py-2 font-semibold"
                onClick={handlePublish}
              >
                <Upload strokeWidth={1.2} className="mr-2 size-5" />
                <span>Publish</span>
              </DropdownMenuItem>
              <Link
                href={`/magazines/${row.id}/edit`}
                onClick={() => setIsDropdownOpen(false)}
              >
                <DropdownMenuItem className="rounded-lg px-3 py-2 font-semibold">
                  <PencilLine strokeWidth={1.2} className="mr-2 size-5" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="rounded-lg px-3 py-2 font-semibold text-destructive focus:text-destructive"
              >
                <Trash2 strokeWidth={1.2} className="mr-2 size-5" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  magazine.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Publish Magazine</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to publish this magazine? Once
                  published, it will be visible to all users.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button onClick={confirmPublish}>Publish</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}

export default RowActions
