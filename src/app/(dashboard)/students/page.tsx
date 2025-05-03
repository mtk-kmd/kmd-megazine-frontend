import React from 'react'
import { Metadata } from 'next'
import { Students } from '@/features/users/components'

export const metadata: Metadata = {
  title: 'Students',
  description: 'Explore the list of students',
}

const StudentsPage = () => {
  return <Students />
}

export default StudentsPage
