import React from 'react'
import Header from './header'
import CoordinatorList from './coordinator-list'

const Coordinators = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 pb-10">
      <Header />
      <CoordinatorList />
    </div>
  )
}

export default Coordinators
