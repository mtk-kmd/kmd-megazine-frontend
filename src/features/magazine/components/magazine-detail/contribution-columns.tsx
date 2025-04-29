import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { Contribution } from '@/features/magazine/types'
import { ContributionActions } from './contribution-actions'

const getSubmissionStateBadgeVariant = (state: Contribution['state']) => {
  switch (state) {
    case 'submitted':
      return 'info'
    case 'underReview':
      return 'warning'
    case 'selected':
      return 'success'
    case 'rejected':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const contributionColumns: ColumnDef<Contribution>[] = [
  {
    accessorKey: 'student.name',
    header: 'Student Name',
  },
  {
    accessorKey: 'title',
    header: 'Contribution Title',
  },
  {
    accessorKey: 'faculty.name',
    header: 'Faculty Name',
  },
  {
    accessorKey: 'state',
    header: 'Status',
    cell: ({ row }) => {
      const state = row.getValue('state') as Contribution['state']
      return (
        <Badge variant={getSubmissionStateBadgeVariant(state)}>
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'submittedDate',
    header: 'Submitted Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('submittedDate')), 'PPP')
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
