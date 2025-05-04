import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'

import { ContributionActions } from './contribution-actions'
import { Contribution } from '@/features/contribution/types'

const getSubmissionStateBadgeVariant = (
  state: Contribution['submission_status']
) => {
  switch (state) {
    case 'ACCEPTED':
      return 'info'
    case 'PENDING':
      return 'warning'
    case 'REJECTED':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const contributionColumns: ColumnDef<Contribution>[] = [
  {
    accessorKey: 'student',
    header: 'Student Name',
    cell: ({ row }) => {
      const student = row.getValue('student') as Contribution['student']
      return `${student.first_name} ${student.last_name}`
    },
  },
  {
    accessorKey: 'title',
    header: 'Contribution Title',
  },
  {
    accessorKey: 'student.StudentFaculty.faculty.name',
    header: 'Faculty Name',
  },
  {
    accessorKey: 'submission_status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue(
        'submission_status'
      ) as Contribution['submission_status']
      return (
        <Badge variant={getSubmissionStateBadgeVariant(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('submittedAt')), 'PPP')
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <ContributionActions contribution={row.original} />
    },
  },
]

export default contributionColumns
