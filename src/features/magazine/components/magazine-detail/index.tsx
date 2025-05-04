'use client'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useGetMagazine } from '../../api/megazine'
import contributionColumns from './contribution-columns'

const MagazineDetail = () => {
  const session = useSession()
  const { magazineId } = useParams<{ magazineId: string }>()
  const accessToken = session?.data?.user.token as string

  const { data, isPending, error, isSuccess } = useGetMagazine(
    accessToken,
    parseInt(magazineId),
    !!accessToken
  )

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isSuccess) {
    const { result: event } = data

    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/magazines">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="flex space-x-2">
              {data.result.status !== 'FINALIZED' && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/magazines/${data.result.event_id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </>
              )}
              {data.result.status === 'FINALIZED' && (
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="mb-4 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {data.result.title}
            </h2>

            <Card className="shadow-none">
              <CardContent className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-4">
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </h3>
                  <Badge
                    className="px-3 py-1 text-xs font-normal"
                    variant={
                      event.status === 'FINALIZED'
                        ? 'success'
                        : event.status === 'CLOSED'
                          ? 'warning'
                          : 'info'
                    }
                  >
                    <span className="first-letter:uppercase">
                      {event.status.toLowerCase()}
                    </span>
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                    Close Date
                  </h3>
                  <p className="text-sm">
                    {format(new Date(event.closure.entry_closure), 'PPP')}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                    Final Close Date
                  </h3>
                  <p className="text-sm">
                    {format(new Date(event.closure.final_closure), 'PPP')}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                    Created At
                  </h3>
                  <p className="text-sm">
                    {format(new Date(event.createdAt), 'PPP')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Contributions</h2>
          <DataTable
            columns={contributionColumns}
            data={data.result.StudentSubmission}
          />
        </div>
      </div>
    )
  }
  return null
}

export default MagazineDetail
