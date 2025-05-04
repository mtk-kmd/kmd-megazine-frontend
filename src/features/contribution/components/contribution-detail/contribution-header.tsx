import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Contribution } from '../../types'
import { ROLE_NAME } from '@/utils/constants'
import { useSession } from 'next-auth/react'

interface ContributionHeaderProps {
  contribution: Contribution
}

export function ContributionHeader({ contribution }: ContributionHeaderProps) {
  const session = useSession()
  const accessToken = session?.data?.user.token as string
  const role_id = session?.data?.user.data.role_id as keyof typeof ROLE_NAME

  const role = ROLE_NAME[role_id]

  return (
    <div className="flex items-center justify-between">
      <Button size="sm" className="gap-2" variant="secondary">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      {role === 'marketing_coordinator' && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Reject
          </Button>
          <Button
            variant="default"
            className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  )
}
