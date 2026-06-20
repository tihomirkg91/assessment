import {
  Box,
  Container,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { lazy, Suspense, startTransition, useState } from 'react'

const ViewBills = lazy(() =>
  import('./components/bills/ViewBills').then((m) => ({
    default: m.ViewBills,
  })),
)
const ViewFavorites = lazy(() =>
  import('./components/favorites/ViewFavorites').then((m) => ({
    default: m.ViewFavorites,
  })),
)
const TabFallback = () => <LinearProgress sx={{ mt: 2 }} />

const App = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [billType, setBillType] = useState<string | null>(null)
  const [allBillTypes, setAllBillTypes] = useState<string[]>([])

  const handleTypeChange = (_: React.MouseEvent, value: string | null) => {
    if (value === null) return
    startTransition(() => setBillType(value === '__all__' ? null : value))
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box>
        <Typography
          variant="h4"
          sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
        >
          Oireachtas Legislation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, md: 3 } }}>
          Browse legislation from the Houses of the Oireachtas. Click a row to see full title
          details in English and Gaeilge.
        </Typography>

        <Stack
          direction="row"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="Bills" />
            <Tab label="Favourites" />
          </Tabs>
          <ToggleButtonGroup
            value={billType ?? '__all__'}
            exclusive
            onChange={handleTypeChange}
            size="small"
            color="primary"
          >
            <ToggleButton value="__all__">All Types</ToggleButton>
            {allBillTypes.map((type) => (
              <ToggleButton key={type} value={type}>
                {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        {activeTab === 0 && (
          <Suspense fallback={<TabFallback />}>
            <ViewBills billType={billType} onBillTypesLoad={setAllBillTypes} />
          </Suspense>
        )}
        {activeTab === 1 && (
          <Suspense fallback={<TabFallback />}>
            <ViewFavorites key={billType} billType={billType} />
          </Suspense>
        )}
      </Box>
    </Container>
  )
}

export default App
