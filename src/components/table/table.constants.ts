export type SortField = 'billNo' | 'billType' | 'status' | 'sponsor'
export type SortDirection = 'asc' | 'desc'

export interface ColDef {
  id: string
  label: string
  sortable: boolean
  width?: { xs?: number | string; sm?: number | string }
  align?: 'center'
}

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
  current: 'success',
  enacted: 'success',
  lapsed: 'warning',
  withdrawn: 'warning',
  initiated: 'info',
  published: 'info',
}

export const getStatusColor = (s: string) =>
  STATUS_COLORS[Object.keys(STATUS_COLORS).find((k) => s.toLowerCase().includes(k)) ?? ''] ??
  'default'

export const PAGE_SIZE = 20

export const COLUMNS: ColDef[] = [
  {
    id: 'billNo',
    label: 'Bill No.',
    sortable: true,
    width: { xs: 'auto', sm: 110 },
  },
  {
    id: 'billType',
    label: 'Type',
    sortable: true,
    width: { xs: 'auto', sm: 100 },
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    width: { xs: 'auto', sm: 120 },
  },
  {
    id: 'sponsor',
    label: 'Sponsor',
    sortable: true,
    width: { xs: 140 },
  },
  {
    id: 'favorite',
    label: '★',
    sortable: false,
    width: { xs: 48, sm: 60 },
    align: 'center',
  },
]
