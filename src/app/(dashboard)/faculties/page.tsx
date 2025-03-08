'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronsUpDown, PencilLine, Plus, Trash2, View } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const data: Faculty[] = [
  {
    id: 1,
    facultyName: 'IT',
    coordinatorId: '019873',
    coordinatorName: 'Aung Aung',
    studentCount: 200,
    totalContributions: 2000,
  },
  {
    id: 1,
    facultyName: 'IT',
    coordinatorId: '019873',
    coordinatorName: 'Aung Aung',
    studentCount: 200,
    totalContributions: 2000,
  },
  {
    id: 1,
    facultyName: 'IT',
    coordinatorId: '019873',
    coordinatorName: 'Aung Aung',
    studentCount: 200,
    totalContributions: 2000,
  },
  {
    id: 1,
    facultyName: 'IT',
    coordinatorId: '019873',
    coordinatorName: 'Aung Aung',
    studentCount: 200,
    totalContributions: 2000,
  },
  {
    id: 1,
    facultyName: 'IT',
    coordinatorId: '019873',
    coordinatorName: 'Aung Aung',
    studentCount: 200,
    totalContributions: 2000,
  },
]

export type Faculty = {
  id: number
  facultyName: string
  coordinatorId: string
  coordinatorName: string
  studentCount: number
  totalContributions: number
}

export const columns: ColumnDef<Faculty>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'No.',
    cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'facultyName',
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
    accessorKey: 'action',
    header: () => <div>Action</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('action'))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return (
        <div className="flex gap-8">
          <View strokeWidth={1.2} className="font text-green-600" />
          <PencilLine strokeWidth={1.2} className="text-blue-600" />
          <Trash2 strokeWidth={1.2} className="text-red-600" />
        </div>
      )
    },
  },
]

export default function FalcultiesPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search"
          value={
            (table.getColumn('coordinatorName')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) =>
            table
              .getColumn('coordinatorName')
              ?.setFilterValue(event.target.value)
          }
          className="max-w-xs"
        />
        <Button>
          <Plus />
          Create New
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-black" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-4" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
