import React from 'react'
import Header from './header'
import ManagerList from './manager-list'

const Managers = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <Header />
      <ManagerList />
    </div>
  )
}

export default Managers
