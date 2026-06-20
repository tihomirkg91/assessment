import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchBills } from '../api/bills.api'
import type { BillView } from '../types/bills.types'
import { extractBillTypes, toBillView } from '../utils/utils'

const DEFAULT_LIMIT = 20

interface UseBillsQueryResult {
  bills: BillView[]
  billTypes: string[]
  totalCount: number
  isFetching: boolean
}

// Fetches a paginated, optionally filtered list of bills
export const useBillsQuery = (page: number, billType: string | null): UseBillsQueryResult => {
  const { data, isFetching } = useSuspenseQuery({
    queryKey: ['bills', { page, limit: DEFAULT_LIMIT, billType }],
    queryFn: () => fetchBills({ page, limit: DEFAULT_LIMIT, billType }),
    staleTime: 60_000, // 1 minute
  })

  const bills = data?.results?.map(toBillView) ?? []
  const billTypes = data?.results ? extractBillTypes(data.results) : []
  const totalCount = data?.head?.counts?.resultCount ?? 0

  return { bills, billTypes, totalCount, isFetching }
}
