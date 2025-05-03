import React from 'react'

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your institution&apos;s metrics and activities.
        </p>
      </div>
    </div>
  )
}

export default Header
