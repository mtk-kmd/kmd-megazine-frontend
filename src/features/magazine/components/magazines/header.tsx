'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AddMagazine } from './add-magazine'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { ROLE_NAME } from '@/utils/constants'

export function Header() {
  const session = useSession()
  const role_id = session?.data?.user.data.role_id as keyof typeof ROLE_NAME

  const role = ROLE_NAME[role_id]

  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleAddOpen = (open: boolean) => {
    setIsAddOpen(open)
  }

  const headerDesc =
    role === 'student'
      ? 'Browse magazines and contribute your articles'
      : 'Manage and monitor all magazines here'

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Magazines</h2>
          <p className="text-muted-foreground">{headerDesc}</p>
        </div>
        {role === 'admin' && (
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={() => handleAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </div>
        )}
        <AddMagazine open={isAddOpen} onOpenChange={handleAddOpen} />
      </div>
    </>
  )
}
