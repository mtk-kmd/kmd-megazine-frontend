import { ColumnDef } from '@tanstack/react-table'
import { User } from '@/features/users/types'
import { ChevronsUpDown } from 'lucide-react'

import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import RowActions from './row-actions'

export const columns: ColumnDef<User>[] = [
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
    cell({ row }) {
      const name = row.getValue<string>('user_name')
      return <div className="whitespace-nowrap">{name}</div>
    },
  },
  {
    accessorKey: 'email',
    header: () => <div className="whitespace-nowrap">Email</div>,
    filterFn: 'includesString',
    cell({ row }) {
      const email = row.getValue<string>('email')
      return <div className="whitespace-nowrap">{email}</div>
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
        <Badge variant={status === 'Active' ? 'success' : 'destructive'}>
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
      const user = row.original
      return <RowActions row={user} />
    },
  },
]
