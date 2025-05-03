import React from 'react'

const Header = () => {
  return (
    <div className="sm:flex sm:items-center">
      <div className="space-y-1 sm:flex-auto">
        <h1 className="text-2xl font-bold tracking-tight">Guests</h1>
        <p className="mt-2 text-sm">
          A list of all the guests in your institute.
        </p>
      </div>
    </div>
  )
}

export default Header
