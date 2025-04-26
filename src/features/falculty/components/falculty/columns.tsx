import RowActions from './row-actions'
import { ChevronsUpDown } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { FacultyResponseItem } from '@/features/falculty/types'

export const columns: ColumnDef<FacultyResponseItem>[] = [
  {
    accessorKey: 'ID',
    accessorFn: (row) => row.faculty_id,
    id: 'faculty_id',
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
    accessorKey: 'name',
    filterFn: 'includesString',
    header: () => {
      return (
        <div className="flex items-center gap-10 text-left">Faculty Name</div>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    id: 'student-count',
    accessorFn: (row) => row.students.length,
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-4 text-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Student Count
          <ChevronsUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => {
      const studentCount = row.original.students.length || 0
      return (
        <div
          className={cn(
            'font-medium capitalize',
            !studentCount && 'text-muted-foreground'
          )}
        >
          {studentCount ? studentCount : 'No'} Students
        </div>
      )
    },
  },
  {
    id: 'coordinator',
    header: 'Coordinator Name',
    cell: ({ row }) => {
      return (
        <div key={row.original?.coordinator?.user_id}>
          {row.original?.coordinator
            ? row.original?.coordinator.user_name
            : 'N/A'}
        </div>
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
