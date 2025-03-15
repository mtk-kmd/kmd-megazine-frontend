'use client'
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AddStudent from './add-student'

const Header = () => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const handleAddFormOpen = (open: boolean) => {
    setIsAddFormOpen(open)
  }

  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold">Students</h1>
        <p className="mt-2 text-sm">
          A list of all the students in your institute.
        </p>
      </div>
      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <Button onClick={() => handleAddFormOpen(true)} size="sm">
          <Plus className="size-5" />
          Add New
        </Button>
        <AddStudent open={isAddFormOpen} onOpenChange={handleAddFormOpen} />
      </div>
    </div>
  )
}

export default Header
