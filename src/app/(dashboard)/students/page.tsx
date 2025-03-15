import React from 'react'
import Students from '@/features/users/components/students'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Students',
  description: 'Explore the list of students',
}

const StudentsPage = () => {
  return <Students />
}

export default StudentsPage
