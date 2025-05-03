import React from 'react'
import { Metadata } from 'next'
import { Guests } from '@/features/users/components'

export const metadata: Metadata = {
  title: 'Guests',
  description: 'Explore the list of guests',
}

const GuestsPage = () => {
  return <Guests />
}

export default GuestsPage
