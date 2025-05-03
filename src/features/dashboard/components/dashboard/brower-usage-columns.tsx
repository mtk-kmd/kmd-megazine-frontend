import { BrowserUsage } from '../../types'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<BrowserUsage>[] = [
  {
    accessorKey: 'user_id',
    header: 'User ID',
    cell: ({ row }) => row.getValue('user_id') || 'Unknown',
  },
  {
    accessorKey: 'user',
    header: 'Name',
    cell: ({ row }) => row.getValue('user') || 'Unknown',
  },
  {
    accessorKey: 'browser_name',
    header: 'Browser Name',
    cell: ({ row }) => row.getValue('browser_name') || 'Unknown',
  },
  {
    accessorKey: 'browser_version',
    header: 'Browser Version',
    cell: ({ row }) => row.getValue('browser_version') || 'Unknown',
  },
]
