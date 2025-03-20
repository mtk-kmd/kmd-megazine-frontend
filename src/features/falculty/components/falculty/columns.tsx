import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ColumnDef } from '@tanstack/react-table'
import { Faculty } from '@/features/falculty/types'
import { ChevronsUpDown, PencilLine, Trash2, View } from 'lucide-react'

export const columns: ColumnDef<Faculty>[] = [
  {
    accessorKey: 'id',
    header: 'No.',
    cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'facultyName',
    filterFn: 'includesString',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-10 text-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Faculty Name
          <ChevronsUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => <div>{row.getValue('facultyName')}</div>,
  },
  {
    accessorKey: 'coordinatorId',
    header: 'Coordinator ID',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('coordinatorId')}</div>
    ),
  },
  {
    accessorKey: 'coordinatorName',
    header: 'Coordinator Name',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('coordinatorName')}</div>
    ),
  },
  {
    accessorKey: 'studentCount',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-10 text-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Student Count
          <ChevronsUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => <div>{row.getValue('studentCount')}</div>,
  },
  {
    accessorKey: 'totalContributions',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-10 text-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Contributions
          <ChevronsUpDown size={16} />
        </div>
      )
    },
    cell: ({ row }) => <div>{row.getValue('totalContributions')}</div>,
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <div className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <View
                  strokeWidth={1.2}
                  className="font size-5 text-green-600"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
              View
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <PencilLine
                  strokeWidth={1.2}
                  className="size-5 text-blue-600"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
              Edit
            </TooltipContent>
          </Tooltip>

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
