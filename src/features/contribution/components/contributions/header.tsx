'use client'

import { useSession } from 'next-auth/react'
import { ROLE_NAME } from '@/utils/constants'

export function Header() {
  const session = useSession()
  const role_id = session?.data?.user.data.role_id as keyof typeof ROLE_NAME

  const role = ROLE_NAME[role_id]

  const headerDesc =
    role === 'student'
      ? 'Submit your contributions and track their status'
      : 'Review and manage student contributions'

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Contributions</h2>
          <p className="text-muted-foreground">{headerDesc}</p>
        </div>
      </div>
    </>
  )
}
