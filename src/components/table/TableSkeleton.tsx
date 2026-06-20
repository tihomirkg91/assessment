import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { useRef } from 'react'
import { TableColGroup } from './TableColGroup'
import { TableHeader } from './TableHeader'
import { COLUMNS, PAGE_SIZE } from './table.constants'

const sharedSx = {
  borderTop: 'none',
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  overflow: 'hidden',
} as const

export const TableSkeleton = () => {
  const rowKeys = useRef<string[] | null>(null)
  if (rowKeys.current === null)
    rowKeys.current = Array.from({ length: PAGE_SIZE }, () => crypto.randomUUID())

  const skeletonCells = COLUMNS.map((col) => (
    <TableCell key={col.id}>
      <div className="sk" />
    </TableCell>
  ))

  const skeletonRows = rowKeys.current.map((key) => <TableRow key={key}>{skeletonCells}</TableRow>)

  return (
    <Box>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderBottom: 'none',
          overflow: 'hidden',
        }}
      >
        <Table size="medium" sx={{ tableLayout: 'fixed' }}>
          <TableColGroup cols={COLUMNS} />
          <TableHeader sortField="billNo" sortDir="asc" onSort={() => {}} visibleCols={COLUMNS} />
        </Table>
      </Paper>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          ...sharedSx,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <TableContainer>
          <Table size="medium" sx={{ tableLayout: 'fixed' }}>
            <TableColGroup cols={COLUMNS} />
            <TableBody>{skeletonRows}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
