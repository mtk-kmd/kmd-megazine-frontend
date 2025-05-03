import React from 'react'
import Dashboard from '@/features/dashboard/components/dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
}

const DashboardPage = () => {
  return <Dashboard />
}

export default DashboardPage
