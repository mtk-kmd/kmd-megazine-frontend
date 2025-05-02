import { useSession } from 'next-auth/react'
import { columns } from './columns'

import { DataTable } from '@/components/ui/data-table'
import { useGetMagazines } from '../../api/megazine'

export function MagazineList() {
  const session = useSession()
  const accessToken = session?.data?.user.token as string

  const {
    isLoading,
    data: { result = [] } = {},
    error,
    isSuccess,
  } = useGetMagazines(accessToken, !!accessToken)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  if (isSuccess) {
    return (
      <DataTable
        searchLabel="Search by title"
        data={result}
        columns={columns}
      />
    )
  }

  return null
}
