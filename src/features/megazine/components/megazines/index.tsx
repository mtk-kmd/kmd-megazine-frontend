'use client'
import React from 'react'
import { Header } from './header'
import { MagazineList } from './magazine-list'

const Magazines = () => {
  return (
    <div className="space-y-6">
      <Header />
      <MagazineList />
    </div>
  )
}

export default Magazines
