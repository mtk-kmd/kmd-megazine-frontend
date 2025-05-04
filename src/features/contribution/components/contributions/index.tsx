'use client'
import React from 'react'
import { Header } from './header'
import { ContributionList } from './contribution-list'

const Contributions = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 p-0 sm:px-6 sm:py-5 lg:px-8">
      <Header />
      <ContributionList />
    </div>
  )
}

export default Contributions
