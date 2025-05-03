import React from 'react'
import { Metadata } from 'next'
import { AddContribution } from '@/features/contribution/components'

export const metadata: Metadata = {
  title: 'Submit Contribution',
  description: 'Submit your contribution for the magazine.',
}

const AddContributionPage = () => {
  return <AddContribution />
}

export default AddContributionPage
