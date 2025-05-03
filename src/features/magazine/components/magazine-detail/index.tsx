'use client'
import { format } from 'date-fns'
import { Contribution, Event } from '../../types'

import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import contributionColumns from './contribution-columns'
import Link from 'next/link'
import { useGetMagazine } from '../../api/megazine'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const MagazineDetail = () => {
  const session = useSession()
  const { magazineId } = useParams<{ magazineId: string }>()
  const accessToken = session?.data?.user.token as string

  const [isPublishOpen, setIsPublishOpen] = useState(false)

  const handlePublishOpen = (open: boolean) => {
    setIsPublishOpen(open)
  }

  const confirmPublish = () => {
    console.log('Publish magazine:', magazineId)
    setIsPublishOpen(false)
  }

  const [contributions, setContributions] = useState<Contribution[]>([
    {
      id: '1',
      title: 'The Future of AI',
      state: 'selected',
      submittedDate: '2025-03-10T14:30:00Z',
      student: { id: '101', name: 'John Doe', email: 'john.doe@example.com' },
      faculty: { id: '201', name: 'Information Science' },
      images: [
        'https://images.unsplash.com/photo-1742836531244-de8454b8bc06?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1745750747228-d7ae37cba3a5?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1745512751454-710500481a82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1745750747233-c09276a878b3?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
      createdAt: '2025-03-10T14:30:00Z',
      comments: [
        {
          id: '301',
          text: 'Great work!',
          coordinator: {
            id: '501',
            name: 'Dr. Johnson',
          },
          createdAt: '2025-03-12T10:00:00Z',
        },
      ],
      articleFile: {
        id: '401',
        name: 'research.pdf',
        url: 'https://kmdeducation-my.sharepoint.com/:w:/g/personal/psthwim1_kmd_edu_mm/EawhryBRDU1Lu2g-CdD7UjEBQh808OpWSTw3sNn8yd6VmQ?e=QcqnKQ',
      },
    },
    {
      id: '2',
      title: 'Exploring renewable energy options...',
      state: 'submitted',
      submittedDate: '2025-03-12T11:20:00Z',
      student: {
        id: '102',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
      faculty: { id: '202', name: 'Information Science' },
      createdAt: '2025-03-12T11:20:00Z',
      comments: [],

      images: [
        'https://images.unsplash.com/photo-1742836531244-de8454b8bc06?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1745750747228-d7ae37cba3a5?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1745512751454-710500481a82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1745750747233-c09276a878b3?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
      articleFile: {
        id: '402',
        name: 'presentation.pptx',
        url: '/files/presentation.pptx',
      },
    },
  ])

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

        <AlertDialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Publish Magazine</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to publish this magazine? Once published,
                it will be visible to all users.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={confirmPublish}>Publish</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Contributions</h2>
          <DataTable columns={contributionColumns} data={contributions} />
        </div>
      </div>
    )
  }
  return null
}

export default MagazineDetail
