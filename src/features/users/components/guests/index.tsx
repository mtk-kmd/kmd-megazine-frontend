import React from 'react'
import Header from './header'
import GuestList from './guest-list'

const Guests = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <Header />
      <GuestList />
    </div>
  )
}

export default Guests
