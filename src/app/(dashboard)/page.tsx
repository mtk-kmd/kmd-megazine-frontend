import React from 'react'
import { Metadata } from 'next'
import { Dashboard } from '@/features/dashboard/components'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
}

const DashboardPage = () => {
  return <Dashboard />
}

export default DashboardPage
