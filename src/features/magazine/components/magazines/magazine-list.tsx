import { columns } from './columns'
import { Magazine } from '../../types'
import { DataTable } from '@/components/ui/data-table'

// Demo data
const demoMagazines: Magazine[] = [
  {
    id: '1',
    title: 'Spring Magazine 2025',
    openDate: '2025-03-01T00:00:00Z',
    closeDate: '2025-04-15T00:00:00Z',
    finalCloseDate: '2025-04-30T00:00:00Z',
    published: true,
  },
  {
    id: '2',
    title: 'Summer Magazine 2025',
    openDate: '2025-06-01T00:00:00Z',
    closeDate: '2025-07-15T00:00:00Z',
    finalCloseDate: '2025-07-30T00:00:00Z',
    published: false,
  },
]

export function MagazineList() {
  return (
    <DataTable
      searchLabel="Search by title"
      data={demoMagazines}
      columns={columns}
    />
  )
}
