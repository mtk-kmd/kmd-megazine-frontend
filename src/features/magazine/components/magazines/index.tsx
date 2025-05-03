'use client'
import React from 'react'
import { Header } from './header'
import { MagazineList } from './magazine-list'

const Magazines = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 p-0 sm:px-6 lg:px-8">
      <Header />
      <MagazineList />
    </div>
  )
}

export default Magazines
