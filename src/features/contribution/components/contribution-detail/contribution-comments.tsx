import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Send } from 'lucide-react'
import { format } from 'date-fns'
import { Contribution } from '../../types'
import { ErrorWidget } from '@/components/ui/error-widget'

interface ContributionCommentsProps {
  contribution: Contribution
}

export function ContributionComments({
  contribution: { comments },
}: ContributionCommentsProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Comments ({comments.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="divide-y p-0">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="bg-background p-6 transition-colors hover:bg-muted/50"
            >
              <div className="mb-3 flex items-start gap-4">
                <Avatar>
                  <AvatarImage
                    src="/profile-placeholder.png"
                    alt={`${comment.contributor.first_name} ${comment.contributor.last_name}`}
                  />
                  <AvatarFallback>
                    {getInitials(
                      comment.contributor.first_name,
                      comment.contributor.last_name
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {comment.contributor.first_name}{' '}
                        {comment.contributor.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {comment.contributor.role.role_name}
                      </p>
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                    </time>
                  </div>
                  <p className="mt-2 leading-relaxed text-foreground">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <ErrorWidget
            type="no-data"
            title="No comments yet"
            description=" Be the first to leave a comment on this contribution."
          />
        )}
      </CardContent>
      <CardFooter className="border-t p-6">
        <div className="flex w-full gap-4">
          <Avatar>
            <AvatarImage src="/profile-placeholder.png" alt="Current User" />
            <AvatarFallback>CU</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Add your comment..."
              className="min-h-[100px] resize-none bg-background"
            />
            <div className="mt-3 flex justify-end">
              <Button className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Comment
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
