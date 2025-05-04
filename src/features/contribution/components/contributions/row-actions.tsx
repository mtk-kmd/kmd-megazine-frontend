import { PencilLine, View } from 'lucide-react'
import Link from 'next/link'
import { Contribution } from '../../types'
import { useSession } from 'next-auth/react'
import { ROLE_NAME } from '@/utils/constants'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { Button } from '@/components/ui/button'

interface RowActionsProps {
  row: Contribution
}

const RowActions = ({ row }: RowActionsProps) => {
  const session = useSession()
  const role_id = session?.data?.user.data.role_id as keyof typeof ROLE_NAME
  const role = ROLE_NAME[role_id]

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/contributions/${row.submission_id}`}>
            <Button variant="ghost" size="icon">
              <View strokeWidth={1.2} className="font size-5 text-green-600" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg px-4 py-2.5 text-sm font-semibold">
          View
        </TooltipContent>
      </Tooltip>

      {role === 'student' &&
        new Date(row.event.closure.final_closure) > new Date() &&
        (row.submission_status === 'PENDING' ||
          row.submission_status === 'REJECTED') && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/contributions/${row.submission_id}/edit`}>
                <Button variant="ghost" size="icon">
                  <PencilLine
                    strokeWidth={1.2}
                    className="font size-5 text-blue-600"
                  />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg px-4 py-2.5 text-sm font-semibold">
              Edit
            </TooltipContent>
          </Tooltip>
        )}
    </div>
  )
}

export default RowActions
