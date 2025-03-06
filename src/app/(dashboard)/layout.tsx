import DashboardLayout from '@/components/layout/dashboard-layout'
import React from 'react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>
}

export default Layout
