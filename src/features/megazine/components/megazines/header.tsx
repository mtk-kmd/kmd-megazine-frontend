'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AddMagazine } from './add-megazine'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleAddOpen = (open: boolean) => {
    setIsAddOpen(open)
  }

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Magazines</h2>
          <p className="text-muted-foreground">
            Manage and monitor all magazines here
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" onClick={() => handleAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <AddMagazine open={isAddOpen} onOpenChange={handleAddOpen} />
    </>
  )
}
