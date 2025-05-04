'use client'

import { PulseLoader } from 'react-spinners'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ErrorWidget } from '@/components/ui/error-widget'
import { ContributionHeader } from './contribution-header'
import { ContributionSidebar } from './contribution-sidebar'
import { ContributionContent } from './contribution-content'
import { ContributionComments } from './contribution-comments'
import { useGetContribution } from '@/features/contribution/api/contribution'

const ContributionDetail = () => {
  const session = useSession()
  const accessToken = session?.data?.user?.token as string

  const params = useParams<{ contributionId: string }>()
  const contributionId = Number(params.contributionId)

  const {
    isPending,
    error,
    isSuccess,
    data: contribution,
  } = useGetContribution(accessToken, contributionId, !!accessToken)

  if (isPending) {
    return (
      <div className="container mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <PulseLoader color="#3b82f6" size={12} margin={4} />
            <p className="mt-4 text-base font-medium text-muted-foreground">
              Loading contribution details...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-0 sm:px-6 lg:px-8">
        <ErrorWidget
          type="error"
          className="flex min-h-[50vh] items-center justify-center"
          title={error.name}
          description={error.message}
        />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto flex flex-col gap-y-5 p-0 sm:px-6 sm:py-5 lg:px-8">
        <div className="space-y-6">
          <ContributionHeader contribution={contribution.result} />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6">
            <div className="col-span-2 space-y-6">
              <ContributionContent contribution={contribution.result} />
              <ContributionComments contribution={contribution.result} />
            </div>

            <div className="col-span-1">
              <ContributionSidebar contribution={contribution.result} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default ContributionDetail
