import FavoriteIcon from '@mui/icons-material/Favorite'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { lazy, Suspense, useMemo, useState } from 'react'
import { useFavorites } from '../../context/FavoritesContext'
import { useModal } from '../../hooks/useModal.tsx'
import { Table } from '../table/Table'
import { PAGE_SIZE } from '../table/table.constants'

const Modal = lazy(() => import('../table/Modal').then((m) => ({ default: m.Modal })))

interface ViewFavoritesProps {
  billType: string | null
}

// Entry-point component for the ViewFavorites
export const ViewFavorites = ({ billType }: ViewFavoritesProps) => {
  const { favoriteBills, count } = useFavorites()
  const [page, setPage] = useState(0)
  const { selectBill, selectedBill, closeModal } = useModal()

  const filtered = useMemo(
    () => (billType ? favoriteBills.filter((b) => b.billType === billType) : favoriteBills),
    [favoriteBills, billType],
  )

  const start = page * PAGE_SIZE
  const pagedBills = filtered.slice(start, start + PAGE_SIZE)

  if (count === 0)
    return (
      <Stack sx={{ alignItems: 'center', gap: 2, py: { xs: 4, sm: 8 } }}>
        <FavoriteIcon color="disabled" sx={{ fontSize: 48 }} />
        <Typography variant="h4" color="text.secondary" sx={{ textAlign: 'center' }}>
          No favorite bills yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', px: 2 }}>
          Click the star icon next to any bill to add it here.
        </Typography>
      </Stack>
    )

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        {billType
          ? `Showing ${filtered.length} of ${count} favorite bill${count !== 1 ? 's' : ''} (${billType}).`
          : `You have ${count} favorite bill${count !== 1 ? 's' : ''}. Favorites are stored locally in your browser.`}
      </Alert>

      <Table
        bills={pagedBills}
        totalCount={filtered.length}
        page={page}
        limit={PAGE_SIZE}
        isPlaceholderData={false}
        onPageChange={setPage}
        onRowClick={selectBill}
      />
      <Suspense>
        <Modal bill={selectedBill} open={!!selectedBill} onClose={closeModal} />
      </Suspense>
    </Box>
  )
}
