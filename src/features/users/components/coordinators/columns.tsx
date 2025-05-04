import { ChevronsUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { UserWithOptionalFaculty } from '@/features/users/types'

import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import RowActions from './row-actions'

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
    header: () => <div className="whitespace-nowrap">Name</div>,
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
    accessorFn: (row) => row.Faculty?.faculty_id,
    header: () => <div className="whitespace-nowrap">Faculty</div>,
    id: 'faculty',
    accessorKey: 'faculty',
    cell: ({ row }) => {
      return (
        <div
          key={row.original?.Faculty?.faculty_id}
          className="whitespace-nowrap"
        >
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
    header: () => <div className="whitespace-nowrap">Phone</div>,
    cell({ row }) {
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
        <Badge
          variant={status === 'Active' ? 'success' : 'destructive'}
          className="whitespace-nowrap"
        >
          {status}
        </Badge>
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
      return <RowActions row={row.original} />
    },
  },
]
