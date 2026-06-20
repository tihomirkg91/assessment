import Star from '@mui/icons-material/Star'
import StarBorder from '@mui/icons-material/StarBorder'
import { IconButton, Tooltip } from '@mui/material'
import { useFavorites } from '../../context/FavoritesContext'
import type { BillView } from '../../types/bills.types'

export const StarButton = ({ bill }: { bill: BillView }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(bill.id)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    toggleFavorite(bill)
  }

  return (
    <Tooltip title={favorited ? 'Remove from favorites' : 'Add to favorites'}>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-label={favorited ? 'Un-favorite this bill' : 'Favorite this bill'}
        color={favorited ? 'secondary' : 'default'}
      >
        {favorited ? <Star /> : <StarBorder />}
      </IconButton>
    </Tooltip>
  )
}
