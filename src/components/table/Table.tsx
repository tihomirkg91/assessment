import { Box, Table as MuiTable, Paper, TableContainer, TablePagination } from '@mui/material'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useScrollSync } from '../../hooks/useScrollSync'
import { useSort } from '../../hooks/useSort'
import type { BillView } from '../../types/bills.types'
import { TableBody } from './TableBody'
import { TableColGroup } from './TableColGroup'
import { TableHeader } from './TableHeader'
import { COLUMNS, type SortField } from './table.constants'

interface TableProps {
  bills: BillView[]
  totalCount: number
  page: number
  limit: number
  isPlaceholderData: boolean
  onPageChange: (page: number) => void
  onRowClick: (bill: BillView) => void
}
// Main Table component that renders the table with header, body, and pagination. It also handles sorting and synchronizing scroll between header and body.
export const Table = ({
  bills,
  totalCount,
  page,
  limit,
  isPlaceholderData,
  onPageChange,
  onRowClick,
}: TableProps) => {
  const { sorted, sortField, sortDir, toggleSort } = useSort(bills, {
    initialField: 'billNo' as SortField,
    initialDir: 'asc',
  })
  const isMobile = useIsMobile()
  const { headerRef, bodyRef, onHeaderScroll, onBodyScroll } = useScrollSync()

  // TableHeader and TableBody wrapped
  return (
    <Box>
      <Paper
        ref={headerRef}
        elevation={0}
        variant="outlined"
        onScroll={onHeaderScroll}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderBottom: 'none',
          overflowX: isMobile ? 'scroll' : 'auto',
          overflowY: 'hidden',
        }}
      >
        <MuiTable size="medium" sx={{ tableLayout: 'fixed', minWidth: 520 }}>
          <TableColGroup cols={COLUMNS} />
          <TableHeader
            sortField={sortField}
            sortDir={sortDir}
            onSort={toggleSort}
            visibleCols={COLUMNS}
          />
        </MuiTable>
      </Paper>

      <Paper
        ref={bodyRef}
        elevation={0}
        variant="outlined"
        onScroll={onBodyScroll}
        sx={{
          borderTop: 'none',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollMarginTop: '52px',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <TableContainer sx={{ overflow: 'visible' }}>
          <MuiTable size="medium" sx={{ tableLayout: 'fixed', minWidth: 520 }}>
            <TableColGroup cols={COLUMNS} />
            <TableBody
              bills={sorted}
              visibleCols={COLUMNS}
              isPlaceholderData={isPlaceholderData}
              onRowClick={onRowClick}
            />
          </MuiTable>
        </TableContainer>
        {totalCount > limit && (
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, p) => {
              onPageChange(p)
              bodyRef.current?.scrollIntoView({ block: 'start' })
            }}
            rowsPerPage={limit}
            rowsPerPageOptions={[limit]}
            labelDisplayedRows={({ from, to, count }) =>
              isMobile ? `${from}-${to}` : `${from}–${to} of ${count}`
            }
          />
        )}
      </Paper>
    </Box>
  )
}
