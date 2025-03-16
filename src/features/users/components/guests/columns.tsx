import { Trash2 } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDate } from '@/lib/utils'
import { UserWithOptionalFaculty } from '@/features/users/types'

export const columns: ColumnDef<UserWithOptionalFaculty>[] = [
  {
    accessorKey: 'user_id',
    header: 'ID',
  },
  {
    accessorKey: 'user_name',
    header: 'Name',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    filterFn: 'includesString',
  },
  {
    accessorFn: (row) => row.StudentFaculty?.faculty_id,
    header: 'Faculty',
    id: 'faculty',
    accessorKey: 'faculty',
    cell: ({ row }) => {
      return (
        <div key={row.original?.StudentFaculty?.faculty_id}>
          {row.original?.StudentFaculty
            ? row.original?.StudentFaculty.faculty.name
            : 'N/A'}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const facultyId = row.getValue(id)
      return value.includes(facultyId ? String(facultyId) : '')
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = formatDate(row.getValue('createdAt'))
      return (
        <div className="font-medium text-secondary-foreground">{createdAt}</div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 strokeWidth={1.2} className="size-5 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
              Delete
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },
]
