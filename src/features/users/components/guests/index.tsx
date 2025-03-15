import React from 'react'
import Header from './header'
import GuestList from './guest-list'

const Guests = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 pb-10">
      <Header />
      <GuestList />
    </div>
  )
}

export default Guests
