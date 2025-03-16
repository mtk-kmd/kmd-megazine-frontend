import { ColumnDef } from '@tanstack/react-table'
import { UserWithOptionalFaculty } from '@/features/users/types'
import { ChevronsUpDown } from 'lucide-react'

import RowActions from './row-actions'
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
    header: 'Student Name',
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
      return <RowActions row={row.original} />
    },
  },
]
