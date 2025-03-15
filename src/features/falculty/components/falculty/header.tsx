'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold">Faculty</h1>
        <p className="mt-2 text-sm">
          A list of all the faculties in your institute.
        </p>
      </div>
      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <Button size="sm">
          <Plus className="size-5" />
          Add New
        </Button>
      </div>
    </div>
  )
}

export default Header
