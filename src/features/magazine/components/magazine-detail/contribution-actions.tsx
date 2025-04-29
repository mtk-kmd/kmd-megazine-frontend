'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Contribution } from '@/features/magazine/types'
import ContributionDetail from './contribution-detail'

interface ContributionActionsProps {
  contribution: Contribution
}

export function ContributionActions({
  contribution,
}: ContributionActionsProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <ContributionDetail
        open={open}
        onOpenChange={setOpen}
        contribution={contribution}
      />
    </>
  )
}
