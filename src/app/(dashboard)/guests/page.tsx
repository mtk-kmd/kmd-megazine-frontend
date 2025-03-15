import React from 'react'
import Guests from '@/features/users/components/guests'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guests',
  description: 'Explore the list of guests',
}

const GuestsPage = () => {
  return <Guests />
}

export default GuestsPage
