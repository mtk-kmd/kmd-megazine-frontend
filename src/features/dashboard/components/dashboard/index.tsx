import React from 'react'
import Statistic from './statistic'
import BrowserUsage from './brower-usage'
import Header from './header'

const Dashboard = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 p-0 sm:px-6 sm:py-5 lg:px-8">
      <Header />
      <Statistic />
      <BrowserUsage />
    </div>
  )
}

export default Dashboard
