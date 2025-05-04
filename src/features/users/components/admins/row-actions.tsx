'use client'

import React from 'react'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { View } from 'lucide-react'
import { User } from '@/features/users/types'
import { Button } from '@/components/ui/button'

const RowActions: React.FC<{ row: User }> = ({ row }) => {
  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/managers/${row.user_id}`}>
            <Button variant="ghost" size="icon">
              <View strokeWidth={1.2} className="font size-5 text-green-600" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg px-4 py-2.5 text-sm font-semibold">
          View
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default RowActions
