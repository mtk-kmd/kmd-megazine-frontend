import React from 'react'
import { Metadata } from 'next'
import Managers from '@/features/users/components/managers'

export const metadata: Metadata = {
  title: 'Students',
  description: 'Explore the list of students',
}

const ManagersPage = () => {
  return <Managers />
}

export default ManagersPage
