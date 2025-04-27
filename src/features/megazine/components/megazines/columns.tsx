import { format } from 'date-fns'
import RowActions from './row-actions'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { Magazine } from '@/features/megazine/types'

export const columns: ColumnDef<Magazine>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'openDate',
    header: 'Open Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('openDate')), 'PPP')
    },
  },
  {
    accessorKey: 'closeDate',
    header: 'Close Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('closeDate')), 'PPP')
    },
  },
  {
    accessorKey: 'finalCloseDate',
    header: 'Final Close Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('finalCloseDate')), 'PPP')
    },
  },
  {
    accessorKey: 'published',
    header: 'Status',
    cell: ({ row }) => {
      const published = row.getValue('published') as boolean
      return (
        <Badge
          className="px-3 py-1.5"
          variant={published ? 'success' : 'destructive'}
        >
          {published ? 'Published' : 'Draft'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions row={row.original} />,
  },
]
