import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { User } from '@/features/users/types'
import { ChevronsUpDown, PencilLine, Trash2, View } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import RowActions from './row-actions'

export const columns: ColumnDef<User>[] = [
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
      const user = row.original
      return <RowActions row={user} />
    },
  },
]
