import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PencilLine, Trash2, View } from 'lucide-react'
import { FacultyResponseItem } from '@/features/falculty/types'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const RowActions: React.FC<{ row: FacultyResponseItem }> = ({ row }) => {
  const session = useSession()

  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/faculties/${row.faculty_id}`}>
            <Button variant="ghost" size="icon">
              <View strokeWidth={1.2} className="font size-5 text-green-600" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
          View
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/faculties/${row.faculty_id}/edit`}>
            <Button variant="ghost" size="icon">
              <PencilLine strokeWidth={1.2} className="size-5 text-blue-600" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg px-3 py-2 font-semibold">
          Edit
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default RowActions
