import React from 'react'
import Header from './header'
import CoordinatorList from './coordinator-list'

const Coordinators = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 p-0 sm:px-6 lg:px-8">
      <Header />
      <CoordinatorList />
    </div>
  )
}

export default Coordinators
