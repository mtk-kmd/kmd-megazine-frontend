import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from '@/lib/utils'
import { UserWithOptionalFaculty } from '@/features/users/types'
import RowActions from './row-actions'

export const columns: ColumnDef<UserWithOptionalFaculty>[] = [
  {
    accessorKey: 'user_id',
    header: () => <div className="whitespace-nowrap">ID</div>,
    cell({ row }) {
      const id = row.getValue<string>('user_id')
      return <div className="whitespace-nowrap">{id}</div>
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
    accessorFn: (row) => row.StudentFaculty?.faculty_id,
    header: () => <div className="whitespace-nowrap">Faculty</div>,
    id: 'faculty',
    accessorKey: 'faculty',
    cell: ({ row }) => {
      return (
        <div
          className="whitespace-nowrap"
          key={row.original?.StudentFaculty?.faculty_id}
        >
          {row.original?.StudentFaculty
            ? row.original?.StudentFaculty.faculty.name
            : 'N/A'}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const facultyId = row.getValue(id)
      return value.includes(facultyId ? String(facultyId) : '')
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
