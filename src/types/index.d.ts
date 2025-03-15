declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export type Role = {
  role_id: number
  role_name: string
  createdAt: string
  updatedAt: string
}
