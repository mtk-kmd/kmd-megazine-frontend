import { format } from 'date-fns'
import RowActions from './row-actions'
import { Contribution } from '../../types'
import { ColumnDef } from '@tanstack/react-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { AlertTriangle, Check, Download, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import DownloadAction from './download-action'

export const columns: ColumnDef<Contribution>[] = [
  {
    accessorKey: 'submission_id',
    header: () => <div className="whitespace-nowrap">ID</div>,
  },
  {
    accessorKey: 'title',
    header: () => <div className="whitespace-nowrap">Title</div>,
    filterFn: 'includesString',
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'submission_status',
    header: () => <div className="whitespace-nowrap">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue('submission_status') as string

      const statusConfig = {
        ACCEPTED: {
          icon: Check,
          className: 'text-green-500',
          variant: 'success',
        },
        PENDING: {
          icon: Loader,
          className: 'text-yellow-500',
          variant: 'warning',
        },
        REJECTED: {
          icon: AlertTriangle,
          className: 'text-red-500',
          variant: 'destructive',
        },
      }

      const {
        icon: Icon,
        className,
        variant,
      } = statusConfig[status as keyof typeof statusConfig] || {
        icon: null,
        className: 'text-gray-600',
        variant: 'default',
      }

      return (
        <Badge
          variant={variant as BadgeProps['variant']}
          className="whitespace-nowrap rounded-sm px-2 py-1"
        >
          {Icon && <Icon className={cn('mr-1 h-3 w-3', className)} />}
          <span className="capitalize">{status.toLowerCase()}</span>
        </Badge>
      )
    },
  },
  {
    accessorKey: 'submittedAt',
    header: () => <div className="whitespace-nowrap">Submitted At</div>,
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {format(new Date(row.getValue('submittedAt')), 'PPP')}
      </div>
    ),
  },
  {
    accessorKey: 'uploadUrl',
    header: () => <div className="whitespace-nowrap">No. of Upload</div>,
    cell: ({ row }) => {
      return <DownloadAction row={row.original} />
    },
  },
  {
    accessorKey: 'updatedAt',
    header: () => <div className="whitespace-nowrap">Last Updated</div>,
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {format(new Date(row.getValue('updatedAt')), 'PPP')}
      </div>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="whitespace-nowrap">Actions</div>,
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        <RowActions row={row.original} />
      </div>
    ),
  },
]
