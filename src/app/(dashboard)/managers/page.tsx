import React from 'react'
import { Metadata } from 'next'
import { Managers } from '@/features/users/components'

export const metadata: Metadata = {
  title: 'Managers',
  description: 'Explore the list of managers',
}

const ManagersPage = () => {
  return <Managers />
}

export default ManagersPage
