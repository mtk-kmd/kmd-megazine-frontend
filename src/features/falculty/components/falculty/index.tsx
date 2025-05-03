import React from 'react'
import Header from './header'
import FalcultyList from './falculty-list'

const Falculty = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <Header />
      <FalcultyList />
    </div>
  )
}

export default Falculty
