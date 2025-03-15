import React from 'react'

const Header = () => {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold">Guests</h1>
        <p className="mt-2 text-sm">
          A list of all the guests in your institute.
        </p>
      </div>
    </div>
  )
}

export default Header
