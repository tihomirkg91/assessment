import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import type { ColDef, SortDirection, SortField } from './table.constants'

interface HeaderCellsProps {
  visibleCols: ColDef[]
  sortField: SortField
  sortDir: SortDirection
  onSort: (field: SortField) => void
}

const HeaderCells = ({ visibleCols, sortField, sortDir, onSort }: HeaderCellsProps) =>
  visibleCols.map((col) => (
    <TableCell
      key={col.id}
      align={col.align}
      sx={{
        ...(col.width && { width: col.width }),
        fontWeight: 600,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {col.sortable ? (
        <TableSortLabel
          active={sortField === col.id}
          direction={sortField === col.id ? sortDir : 'asc'}
          onClick={() => onSort(col.id as SortField)}
        >
          {col.label}
        </TableSortLabel>
      ) : (
        col.label
      )}
    </TableCell>
  ))

interface TableHeaderProps {
  sortField: SortField
  sortDir: SortDirection
  onSort: (field: SortField) => void
  visibleCols: ColDef[]
}

export const TableHeader = ({ sortField, sortDir, onSort, visibleCols }: TableHeaderProps) => (
  <TableHead>
    <TableRow>
      <HeaderCells
        visibleCols={visibleCols}
        sortField={sortField}
        sortDir={sortDir}
        onSort={onSort}
      />
    </TableRow>
  </TableHead>
)
