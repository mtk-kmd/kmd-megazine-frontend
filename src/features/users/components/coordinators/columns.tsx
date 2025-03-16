import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { User, UserWithOptionalFaculty } from '@/features/users/types'
import { ChevronsUpDown, PencilLine, Trash2, View } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<UserWithOptionalFaculty>[] = [
  {
    accessorKey: 'user_id',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-4 text-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ChevronsUpDown size={16} />
        </div>
      )
    },
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
    accessorFn: (row) => row.Faculty?.faculty_id,
    header: 'Faculty',
    id: 'faculty',
    accessorKey: 'faculty',
    cell: ({ row }) => {
      return (
        <div key={row.original?.Faculty?.faculty_id}>
          {row.original?.Faculty ? row.original?.Faculty.name : 'N/A'}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const facultyId = row.getValue(id)
      return value.includes(facultyId ? String(facultyId) : '')
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell({ row }) {
      const phone = row.getValue<string>('phone')
      return <div>{phone ? phone : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status =
        row.getValue<boolean>('status') === true ? 'Active' : 'Inactive'
      return (
        <Badge variant={status === 'Active' ? 'success' : 'destructive'}>
          {status}
        </Badge>
      )
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
      const student = row.original
      return (
        <div className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <View
                  strokeWidth={1.2}
                  className="font size-5 text-green-600"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
              View
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/students/${student.user_id}/edit`}>
                <Button variant="ghost" size="icon">
                  <PencilLine
                    strokeWidth={1.2}
                    className="size-5 text-blue-600"
                  />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
              Edit
            </TooltipContent>
          </Tooltip>

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
