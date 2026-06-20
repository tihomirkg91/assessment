import InboxIcon from '@mui/icons-material/Inbox'
import { TableBody as MuiTableBody, Stack, TableCell, TableRow, Typography } from '@mui/material'
import type { BillView } from '../../types/bills.types'
import { TableBodyRows } from './TableBodyRows'
import type { ColDef } from './table.constants'

interface TableBodyProps {
  bills: BillView[]
  visibleCols: ColDef[]
  isPlaceholderData: boolean
  onRowClick: (bill: BillView) => void
}

export const TableBody = ({
  bills,
  visibleCols,
  isPlaceholderData,
  onRowClick,
}: TableBodyProps) => {
  if (bills.length === 0)
    return (
      <MuiTableBody>
        <TableRow>
          <TableCell colSpan={visibleCols.length}>
            <Stack sx={{ alignItems: 'center', gap: 1, py: 8 }}>
              <InboxIcon color="disabled" sx={{ fontSize: 48 }} />
              <Typography variant="body1" color="text.secondary">
                No bills found
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      </MuiTableBody>
    )

  return (
    <TableBodyRows
      bills={bills}
      visibleCols={visibleCols}
      isPlaceholderData={isPlaceholderData}
      onRowClick={onRowClick}
    />
  )
}
