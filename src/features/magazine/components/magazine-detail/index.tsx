'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Magazine } from '../../types'
import { Contribution } from '../../types'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import contributionColumns from './contribution-columns'
import Link from 'next/link'

const MagazineDetail = () => {
  const [magazine, setMagazine] = useState<Magazine>({
    id: '1',
    title: 'Spring Magazine 2025',
    openDate: '2025-03-01T00:00:00Z',
    closeDate: '2025-04-15T00:00:00Z',
    finalCloseDate: '2025-04-30T00:00:00Z',
    published: false,
  })

  const [contributions, setContributions] = useState<Contribution[]>([
    {
      id: '1',
      title: 'The Future of AI',
      state: 'selected',
      submittedDate: '2025-03-10T14:30:00Z',
      student: { id: '101', name: 'John Doe', email: 'john.doe@example.com' },
      faculty: { id: '201', name: 'Dr. Smith' },
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
      faculty: { id: '202', name: 'Prof. Johnson' },
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

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/magazines">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex space-x-2">
            {!magazine.published ? (
              <>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button size="sm">Publish</Button>
              </>
            ) : (
              <Button variant="outline" size="sm">
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4 space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {magazine.title}
          </h2>

          <Card className="shadow-none">
            <CardContent className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                  Status
                </h3>
                <Badge
                  className="px-3 py-1 text-xs font-normal"
                  variant={magazine.published ? 'success' : 'destructive'}
                >
                  {magazine.published ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                  Open Date
                </h3>
                <p className="text-sm">
                  {format(new Date(magazine.openDate), 'PPP')}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                  Close Date
                </h3>
                <p className="text-sm">
                  {format(new Date(magazine.closeDate), 'PPP')}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                  Final Close Date
                </h3>
                <p className="text-sm">
                  {format(new Date(magazine.finalCloseDate), 'PPP')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Contributions</h2>
        <DataTable columns={contributionColumns} data={contributions} />
      </div>
    </div>
  )
}

export default MagazineDetail
