import { Box } from '@mui/material'
import { lazy, Suspense, useDeferredValue, useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from '../../errorBoundary/ErrorBoundary'
import { useBillsQuery } from '../../hooks/useBillsQuery'
import { useModal } from '../../hooks/useModal.tsx'
import { Table } from '../table/Table'
import { TableSkeleton } from '../table/TableSkeleton'
import { PAGE_SIZE } from '../table/table.constants'

const Modal = lazy(() => import('../table/Modal').then((m) => ({ default: m.Modal })))

interface ViewBillsContentProps {
  billType: string | null
  onBillTypesLoad: (types: string[]) => void
}

// Entry-point component for the ViewBills
const ViewBillsContent = ({ billType, onBillTypesLoad }: ViewBillsContentProps) => {
  const [page, setPage] = useState(0)
  const deferredBillType = useDeferredValue(billType, null)
  const { selectBill, selectedBill, closeModal } = useModal()
  const prevTypesRef = useRef<string>('')

  const { bills, billTypes, totalCount, isFetching } = useBillsQuery(page + 1, deferredBillType)

  useEffect(() => {
    const key = billTypes.join(',')
    if (key && key !== prevTypesRef.current) {
      prevTypesRef.current = key
      onBillTypesLoad(billTypes)
    }
  }, [billTypes, onBillTypesLoad])

  const handlePageChange = (p: number) => setPage(p)

  return (
    <Box>
      <Table
        bills={bills}
        totalCount={totalCount}
        page={page}
        limit={PAGE_SIZE}
        isPlaceholderData={isFetching}
        onPageChange={handlePageChange}
        onRowClick={selectBill}
      />
      <Suspense>
        <Modal bill={selectedBill} open={!!selectedBill} onClose={closeModal} />
      </Suspense>
    </Box>
  )
}

export const ViewBills = ({ billType, onBillTypesLoad }: ViewBillsContentProps) => (
  <ErrorBoundary>
    <Suspense fallback={<TableSkeleton />}>
      <ViewBillsContent billType={billType} onBillTypesLoad={onBillTypesLoad} />
    </Suspense>
  </ErrorBoundary>
)
