import { useState } from 'react'
import type { BillView } from '../types/bills.types'

export const useModal = () => {
  const [bill, setBill] = useState<BillView | null>(null)

  return {
    selectedBill: bill,
    selectBill: (b: BillView) => setBill(b),
    closeModal: () => setBill(null),
  } as const
}
