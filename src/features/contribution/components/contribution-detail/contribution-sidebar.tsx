import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Contribution } from '../../types'

interface ContributionSidebarProps {
  contribution: Contribution
}

export function ContributionSidebar({ contribution }: ContributionSidebarProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <Card className="sticky top-20 overflow-hidden shadow-none">
      <CardHeader className="border-b">
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <div className="divide-y">
        <div className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Event</h3>
          <p className="mt-2 font-medium">{contribution.event.title}</p>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Description
          </h3>
          <p className="mt-2 text-sm leading-relaxed">
            {contribution.event.description}
          </p>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Contributor
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="/profile-placeholder.png"
                alt={`${contribution.student.first_name} ${contribution.student.last_name}`}
              />
              <AvatarFallback>
                {getInitials(
                  contribution.student.first_name,
                  contribution.student.last_name
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {contribution.student.first_name} {contribution.student.last_name}
              </p>
              {contribution.student.StudentFaculty?.faculty.name && (
                <p className="text-sm text-muted-foreground">
                  {contribution.student.StudentFaculty.faculty.name}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Important Dates
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-5 w-1.5 rounded-full bg-secondary-foreground"></div>
                <span className="font-medium text-secondary-foreground">
                  Submitted
                </span>
              </div>
              <span>
                {format(
                  new Date(contribution.submittedAt),
                  'MMM d, yyyy h:mm a'
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-5 w-1.5 rounded-full bg-blue-500"></div>
                <span className="font-medium text-blue-500">Last Updated</span>
              </div>
              <span>
                {format(new Date(contribution.updatedAt), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-5 w-1.5 rounded-full bg-red-500"></div>
                <span className="font-medium text-red-500">Closure Date</span>
              </div>
              <span>
                {format(
                  new Date(contribution.event.closure.final_closure),
                  'MMM d, yyyy h:mm a'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
