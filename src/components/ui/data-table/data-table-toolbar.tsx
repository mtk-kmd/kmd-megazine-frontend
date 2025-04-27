'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { useEffect, useState } from 'react'
import DataTableFacultyFilter from './data-table-faculty-filter'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  searchLabel?: string
  setGlobalFilter: (value: string) => void
}

function DebouncedInput({
  value: initialValue,
  onChange,
  searchLabel = 'Search...',
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  searchLabel?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <Input
      {...props}
      value={value}
      placeholder={searchLabel}
      onChange={(e) => setValue(e.target.value)}
      className="h-9 w-[150px] lg:w-[250px]"
    />
  )
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  searchLabel,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DebouncedInput
          value={globalFilter ?? ''}
          searchLabel={searchLabel}
          onChange={(value) => setGlobalFilter(String(value))}
        />

        {table.getAllColumns().find((column) => column.id === 'faculty') && (
          <DataTableFacultyFilter table={table} />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
