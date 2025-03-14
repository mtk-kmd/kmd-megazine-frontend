import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>
}

export default Layout
