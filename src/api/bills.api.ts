import type { BillApiResponse } from '../../src/types/bills.types'

const BASE_URL = `${import.meta.env['VITE_API_BASE_URL']}/legislation`

interface FetchBillsParams {
  page: number
  limit: number
  billType: string | null
}

export const fetchBills = async ({
  page,
  limit,
  billType,
}: FetchBillsParams): Promise<BillApiResponse> => {
  const skip = (page - 1) * limit
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  })

  if (billType) params.set('bill_type', billType)

  const url = `${BASE_URL}?${params.toString()}`
  const response = await fetch(url)

  if (!response.ok)
    throw new Error(`Failed to fetch bills: ${response.status} ${response.statusText}`)

  return response.json()
}
