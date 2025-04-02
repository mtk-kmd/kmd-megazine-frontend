'use client'

import { Plus } from 'lucide-react'
import AddFaculty from './add-faculty'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const Header = () => {
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false)

  const handleIsAddFacultyOpen = (open: boolean) => {
    setIsAddFacultyOpen(open)
  }

  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold">Faculty</h1>
        <p className="mt-2 text-sm">
          A list of all the faculties in your institute.
        </p>
      </div>
      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <Button onClick={() => handleIsAddFacultyOpen(true)} size="sm">
          <Plus className="size-5" />
          Add New
        </Button>

        <AddFaculty
          open={isAddFacultyOpen}
          onOpenChange={handleIsAddFacultyOpen}
        />
      </div>
    </div>
  )
}

export default Header
