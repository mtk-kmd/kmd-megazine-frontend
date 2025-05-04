import { ArrowLeft } from 'lucide-react'
import { Contribution } from '../../types'
import { ROLE_NAME } from '@/utils/constants'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateSubmissionStatus } from '@/features/contribution/api/contribution'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ContributionHeaderProps {
  contribution: Contribution
}

export function ContributionHeader({ contribution }: ContributionHeaderProps) {
  const session = useSession()
  const router = useRouter()
  const accessToken = session?.data?.user.token as string
  const [loadingStatus, setLoadingStatus] = useState<
    'ACCEPTED' | 'REJECTED' | undefined
  >()

  const role_id = session?.data?.user.data.role_id as keyof typeof ROLE_NAME

  const role = ROLE_NAME[role_id]
  const queryClient = useQueryClient()

  const {
    mutate: updateSubmissionStatus,
    isPending: isUpdateSubmissionStatusPending,
  } = useUpdateSubmissionStatus(accessToken)

  const handleUpdateStatus = (status: 'ACCEPTED' | 'REJECTED') => {
    setLoadingStatus(status)
    updateSubmissionStatus(
      {
        submission_id: contribution.submission_id,
        status,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['contribution', contribution.submission_id],
          })
        },
        onSettled: () => {
          setLoadingStatus(undefined)
        },
      }
    )
  }

  return (
    <div className="flex items-center justify-between">
      <Button
        onClick={() => router.push('/contributions')}
        size="sm"
        className="gap-2"
        variant="secondary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {role === 'student' && (
        <Button size="sm" variant="outline" className="gap-2" asChild>
          <Link href={`/contributions/${contribution.submission_id}/edit`}>
            Edit
          </Link>
        </Button>
      )}

      {role === 'marketing_coordinator' &&
        contribution.submission_status === 'PENDING' && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={isUpdateSubmissionStatusPending}
              loading={
                loadingStatus === 'REJECTED' && isUpdateSubmissionStatusPending
              }
              className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleUpdateStatus('REJECTED')}
            >
              Reject
            </Button>
            <Button
              variant="default"
              disabled={isUpdateSubmissionStatusPending}
              onClick={() => handleUpdateStatus('ACCEPTED')}
              loading={
                loadingStatus === 'ACCEPTED' && isUpdateSubmissionStatusPending
              }
              className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Accept
            </Button>
          </div>
        )}
    </div>
  )
}
