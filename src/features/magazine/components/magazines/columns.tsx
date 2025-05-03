import { format } from 'date-fns'
import RowActions from './row-actions'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { Event } from '@/features/magazine/types'

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'event_id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className="px-3 py-1.5"
        variant={
          row.getValue('status') === 'OPEN'
            ? 'success'
            : row.getValue('status') === 'CLOSED'
              ? 'warning'
              : 'info'
        }
      >
        <span className="first-letter:uppercase">
          {(row.getValue('status') as string).toLowerCase()}
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: 'closure.entry_closure',
    header: 'Entry Closure',
    cell: ({ row }) => {
      const closure = row.original.closure
      return format(new Date(closure.entry_closure), 'PPP')
    },
  },
  {
    accessorKey: 'closure.final_closure',
    header: 'Final Closure',
    cell: ({ row }) => {
      const closure = row.original.closure
      return format(new Date(closure.final_closure), 'PPP')
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'PPP'),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <RowActions row={row.original} />,
  },
]
