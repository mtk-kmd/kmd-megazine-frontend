'use client'
import React from 'react'

import { columns } from './columns'
import { sampleFalcultyData } from '../../data'
import { DataTable } from '@/components/ui/data-table'

const FalcultyList = () => {
  return (
    <DataTable
      columns={columns}
      data={sampleFalcultyData}
      searchLabel="Search by name"
    />
  )
}

export default FalcultyList
