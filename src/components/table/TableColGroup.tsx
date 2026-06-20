import type { ColDef } from './table.constants'

// Single source of truth for column widths
export const TableColGroup = ({ cols }: { cols: ColDef[] }) => {
  const ColGroup = cols.map((col) => (
    <col key={col.id} style={{ width: col.width?.sm ?? col.width?.xs }} />
  ))

  return <colgroup>{ColGroup}</colgroup>
}
