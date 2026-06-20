import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { BillView } from '../../types/bills.types'
import { getStatusColor } from './table.constants'

interface ModalProps {
  bill: BillView | null
  open: boolean
  onClose: () => void
}

export const Modal = ({ bill, open, onClose }: ModalProps) => {
  const [tab, setTab] = useState(0)
  const fullScreen = useIsMobile()

  if (!bill) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="bill-detail-title"
      slotProps={{
        paper: { sx: { borderRadius: { xs: 0, sm: 2 } } },
      }}
    >
      <DialogTitle id="bill-detail-title" sx={{ pr: 6 }}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            {bill.shortTitleEn}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            <Chip label={`Bill No. ${bill.billNo}`} size="small" variant="outlined" />
            <Chip label={bill.billType} size="small" variant="outlined" color="primary" />
            <Chip
              label={bill.status}
              size="small"
              color={getStatusColor(bill.status)}
              variant="outlined"
            />
          </Stack>
        </Stack>
      </DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 12, top: 12 }}
        aria-label="Close dialog"
      >
        <CloseIcon />
      </IconButton>

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, sm: 2 } }}
      >
        <Tab label="English" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Gaeilge" id="tab-1" aria-controls="tabpanel-1" />
      </Tabs>

      <DialogContent>
        <Box role="tabpanel" hidden={tab !== 0}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {bill.longTitleEn || 'No English title available.'}
          </Typography>
        </Box>
        <Box role="tabpanel" hidden={tab !== 1}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {bill.longTitleGa || 'Níl aon teideal Gaeilge ar fáil.'}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
