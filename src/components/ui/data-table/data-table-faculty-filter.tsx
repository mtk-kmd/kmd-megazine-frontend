import React from 'react'
import { Table } from '@tanstack/react-table'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { useGetFalculties } from '@/features/falculty/api/falculty'
import { useSession } from 'next-auth/react'

interface DataTableFacultyFilterProps<TData> {
  table: Table<TData>
}

export function DataTableFacultyFilter<TData>({
  table,
}: DataTableFacultyFilterProps<TData>) {
  const session = useSession()
  const accessToken = session?.data?.user.token as string

  const { isLoading, data, error, isSuccess } = useGetFalculties(
    accessToken,
    !!accessToken
  )

  const getOptions = (): { value: string; label: string }[] => {
    if (isSuccess && data) {
      return data.map((faculty) => ({
        value: faculty.faculty_id.toString(),
        label: faculty.name,
      }))
    }

    return []
  }

  return (
    <DataTableFacetedFilter
      column={table.getColumn('faculty')}
      title="Faculty"
      isLoading={isLoading}
      error={error}
      options={getOptions()}
    />
  )
}

export default DataTableFacultyFilter
