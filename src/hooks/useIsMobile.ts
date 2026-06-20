import { useMediaQuery, useTheme } from '@mui/material'

export const useIsMobile = (): boolean => useMediaQuery(useTheme().breakpoints.down('sm'))
