import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Contribution } from '../../types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Send } from 'lucide-react'
import { ErrorWidget } from '@/components/ui/error-widget'
import { useAddComment } from '@/features/contribution/api/contribution'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ROLE_NAME } from '@/utils/constants'

dayjs.extend(relativeTime)

interface ContributionCommentsProps {
  contribution: Contribution
}

export function ContributionComments({
  contribution: { comments, submission_id, submission_status },
}: ContributionCommentsProps) {
  const [comment, setComment] = useState('')
  const session = useSession()
  const queryClient = useQueryClient()
  const user_id = session?.data?.user?.data?.user_id as number
  const accessToken = session?.data?.user?.token as string

  const role_id = session?.data?.user?.data.role_id as number
  const role = ROLE_NAME[role_id as keyof typeof ROLE_NAME]

  const { mutate: addCommentMutate, isPending: addCommentMutatePending } =
    useAddComment(accessToken)

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const handleSubmitComment = () => {
    addCommentMutate(
      {
        submission_id: submission_id,
        comment,
        user_id,
      },
      {
        onSuccess: async () => {
          setComment('')
          await queryClient.invalidateQueries({
            queryKey: ['contribution', submission_id],
          })
        },
      }
    )
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Discussion
          </CardTitle>
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1.5 text-sm"
          >
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="divide-y p-0 pb-2">
        <ScrollArea>
          <div className="max-h-[300px]">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.comment_id} className="bg-background p-6">
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
                            {comment.contributor.role?.role_name}
                          </p>
                        </div>
                        <time className="text-xs text-muted-foreground">
                          {dayjs(comment.createdAt).fromNow()}
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
          </div>
        </ScrollArea>
      </CardContent>
      {submission_status === 'PENDING' &&
        (role === 'student' || role === 'marketing_coordinator') && (
          <CardFooter className="border-t p-6">
            <div className="flex w-full gap-4">
              <Avatar>
                <AvatarImage
                  src="/profile-placeholder.png"
                  alt="Current User"
                />
                <AvatarFallback>CU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comment..."
                  className="min-h-[100px] resize-none bg-background"
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    disabled={!comment}
                    onClick={handleSubmitComment}
                    loading={addCommentMutatePending}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send Comment
                  </Button>
                </div>
              </div>
            </div>
          </CardFooter>
        )}
    </Card>
  )
}
