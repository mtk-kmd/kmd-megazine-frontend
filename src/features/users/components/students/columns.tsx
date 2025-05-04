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
          className="flex items-center gap-4 whitespace-nowrap text-left"
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
    header: () => <div className="whitespace-nowrap">Student Name</div>,
    filterFn: 'includesString',
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue('user_name')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: () => <div className="whitespace-nowrap">Email</div>,
    filterFn: 'includesString',
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue('email')}</div>
    ),
  },
  {
    accessorFn: (row) => row.StudentFaculty?.faculty_id,
    header: () => <div className="whitespace-nowrap">Faculty</div>,
    id: 'faculty',
    accessorKey: 'faculty',
    cell: ({ row }) => (
      <div
        className="whitespace-nowrap"
        key={row.original?.StudentFaculty?.faculty_id}
      >
        {row.original?.StudentFaculty
          ? row.original?.StudentFaculty.faculty.name
          : 'N/A'}
      </div>
    ),
    filterFn: (row, id, value) => {
      const facultyId = row.getValue(id)
      return value.includes(facultyId ? String(facultyId) : '')
    },
  },
  {
    accessorKey: 'phone',
    header: () => <div className="whitespace-nowrap">Phone</div>,
    cell: ({ row }) => {
      const phone = row.getValue<string>('phone')
      return <div className="whitespace-nowrap">{phone ? phone : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'status',
    header: () => <div className="whitespace-nowrap">Status</div>,
    cell: ({ row }) => {
      const status =
        row.getValue<boolean>('status') === true ? 'Active' : 'Inactive'
      return (
        <div className="whitespace-nowrap">
          <Badge variant={status === 'Active' ? 'success' : 'destructive'}>
            {status}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="whitespace-nowrap">Created At</div>,
    cell: ({ row }) => {
      const createdAt = formatDate(row.getValue('createdAt'))
      return (
        <div className="whitespace-nowrap font-medium text-secondary-foreground">
          {createdAt}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="whitespace-nowrap">
          <RowActions row={row.original} />
        </div>
      )
    },
  },
]
