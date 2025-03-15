import React from 'react'
import Header from './header'
import FalcultyList from './falculty-list'

const Falculty = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 pb-10">
      <Header />
      <FalcultyList />
    </div>
  )
}

export default Falculty
