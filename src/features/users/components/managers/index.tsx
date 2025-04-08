import React from 'react'
import Header from './header'
import ManagerList from './manager-list'

const Managers = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 pb-10">
      <Header />
      <ManagerList />
    </div>
  )
}

export default Managers
