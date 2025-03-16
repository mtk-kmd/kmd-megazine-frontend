import React from 'react'
import { Metadata } from 'next'
import Coordinators from '@/features/users/components/coordinators'

export const metadata: Metadata = {
  title: 'Coordinators',
  description: 'Explore the list of coordinators',
}

const CoordinatorsPage = () => {
  return <Coordinators />
}

export default CoordinatorsPage
