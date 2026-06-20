import { Chip, TableBody as MuiTableBody, TableCell, TableRow, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { BillView } from '../../types/bills.types'
import { StarButton } from './StarButton'
import { type ColDef, getStatusColor } from './table.constants'

const cellRenderers: Record<string, (b: BillView) => ReactNode> = {
  billNo: (b) => (
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {b.billNo}
    </Typography>
  ),
  billType: (b) => <Chip label={b.billType} size="small" variant="outlined" color="primary" />,
  status: (b) => (
    <Chip label={b.status} size="small" color={getStatusColor(b.status)} variant="outlined" />
  ),
  sponsor: (b) => (
    <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
      {b.sponsor}
    </Typography>
  ),
  favorite: (b) => <StarButton bill={b} />,
}

interface TableRowCellsProps {
  bill: BillView
  visibleCols: ColDef[]
}

const TableRowCells = ({ bill, visibleCols }: TableRowCellsProps) =>
  visibleCols.map((col) => (
    <TableCell key={col.id} align={col.align} sx={col.width ? { width: col.width } : undefined}>
      {cellRenderers[col.id]?.(bill) ?? null}
    </TableCell>
  ))

interface TableBodyRowsProps {
  bills: BillView[]
  visibleCols: ColDef[]
  isPlaceholderData: boolean
  onRowClick: (bill: BillView) => void
}

export const TableBodyRows = ({
  bills,
  visibleCols,
  isPlaceholderData,
  onRowClick,
}: TableBodyRowsProps) => (
  <MuiTableBody>
    {bills.map((bill) => (
      <TableRow
        key={bill.id}
        hover
        onClick={() => onRowClick(bill)}
        sx={{
          cursor: 'pointer',
          opacity: isPlaceholderData ? 0.5 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        <TableRowCells bill={bill} visibleCols={visibleCols} />
      </TableRow>
    ))}
  </MuiTableBody>
)
