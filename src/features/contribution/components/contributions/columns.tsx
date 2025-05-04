import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import RowActions from './row-actions'
import { Contribution } from '../../types'
import DownloadAction from './download-action'
import { ColumnDef, Row } from '@tanstack/react-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { AlertTriangle, Check, Loader } from 'lucide-react'

export const getColumns = (role: string): ColumnDef<Contribution>[] => [
  {
    accessorKey: 'submission_id',
    header: () => <div className="whitespace-nowrap">ID</div>,
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue('submission_id')}</div>
    ),
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
        <div className="whitespace-nowrap">
          <Badge
            variant={variant as BadgeProps['variant']}
            className="rounded-sm px-2 py-1"
          >
            {Icon && <Icon className={cn('mr-1 h-3 w-3', className)} />}
            <span className="capitalize">{status.toLowerCase()}</span>
          </Badge>
        </div>
      )
    },
  },
  ...(role === 'admin' || role === 'manager'
    ? [
        {
          accessorFn: (row: Contribution) =>
            row.student?.StudentFaculty?.faculty_id,
          header: () => <div className="whitespace-nowrap">Faculty</div>,
          id: 'faculty',
          accessorKey: 'faculty',
          cell: ({ row }: { row: Row<Contribution> }) => (
            <div
              className="whitespace-nowrap"
              key={row.original?.student?.StudentFaculty?.faculty_id}
            >
              {row.original?.student?.StudentFaculty
                ? row.original?.student?.StudentFaculty.faculty.name
                : 'N/A'}
            </div>
          ),
          filterFn: (row: Row<Contribution>, id: string, value: string) => {
            const facultyId = row.getValue(id)
            return value.includes(facultyId ? String(facultyId) : '')
          },
        },
      ]
    : [
        {
          accessorKey: 'faculty.name',
          header: () => <div className="whitespace-nowrap">Faculty</div>,
          cell: ({ row }: { row: Row<Contribution> }) => (
            <div className="whitespace-nowrap">
              {row.original.student?.StudentFaculty?.faculty.name || 'N/A'}
            </div>
          ),
        },
      ]),
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
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        <DownloadAction row={row.original} />
      </div>
    ),
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
