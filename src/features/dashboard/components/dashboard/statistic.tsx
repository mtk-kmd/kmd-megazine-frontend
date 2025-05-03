'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Send,
  Users,
  UserCheck,
  UserPlus,
  Calendar,
  FileText,
  GraduationCap,
  MessageSquare,
} from 'lucide-react'
import { useSession } from 'next-auth/react'

import { useGetAnalytic } from '@/features/dashboard/api/dashboard'
import { Skeleton } from '@/components/ui/skeleton'

const Statistic = () => {
  const session = useSession()
  const accessToken = session?.data?.user.token as string
  const { data, isPending, error, isSuccess } = useGetAnalytic(
    accessToken,
    !!accessToken
  )

  if (isPending) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="mb-2 h-8 w-20" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isSuccess && data) {
    const statisticItems = [
      {
        title: 'Total Users',
        icon: Users,
        value: data.totalUsers,
        description: 'All registered system users',
        color: 'text-blue-600',
      },
      {
        title: 'Total Faculties',
        icon: GraduationCap,
        value: data.totalFaculties,
        description: 'Faculties assigned for review',
        color: 'text-green-600',
      },
      {
        title: 'Total Contributions',
        icon: FileText,
        value: data.totalContributions,
        description: 'All submitted articles and images',
        color: 'text-yellow-600',
      },
      {
        title: 'Total Student Admissions',
        icon: UserPlus,
        value: data.totalStudentAdmissions,
        description: 'All activated student accounts',
        color: 'text-purple-600',
      },
      {
        title: 'Total Active Users',
        icon: UserCheck,
        value: data.activeUsers,
        description: 'Users who accessed the system',
        color: 'text-pink-600',
      },
      {
        title: 'Total Submissions',
        icon: Send,
        value: data.recentSubmissions,
        description: 'All recorded student submissions',
        color: 'text-indigo-600',
      },
      {
        title: 'Total Events',
        icon: Calendar,
        value: data.totalEvents,
        description: 'Scheduled academic deadlines',
        color: 'text-red-600',
      },
      {
        title: 'Total Comments',
        icon: MessageSquare,
        value: data.totalComments,
        description: 'All coordinator feedback entries',
        color: 'text-teal-600',
      },
    ]

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statisticItems.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return null
}

export default Statistic
