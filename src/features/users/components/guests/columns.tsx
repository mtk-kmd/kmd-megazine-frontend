import { Trash2 } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Student } from '@/features/users/types'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDate } from '@/lib/utils'

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'user_id',
    header: 'ID',
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
    cell: ({}) => {
      return (
        <div className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 strokeWidth={1.2} className="size-5 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
              Delete
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },
]
