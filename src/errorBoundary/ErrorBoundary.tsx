import { Alert, AlertTitle, Button, Stack } from '@mui/material'
import type { ReactNode } from 'react'
import { Component } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error)
      return (
        <Stack sx={{ alignItems: 'center', py: { xs: 4, sm: 8 } }}>
          <Alert
            severity="error"
            sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400 } }}
            action={
              <Button color="inherit" size="small" onClick={() => this.setState({ error: null })}>
                Retry
              </Button>
            }
          >
            <AlertTitle>Failed to load bills</AlertTitle>
            {this.state.error.message}
          </Alert>
        </Stack>
      )

    return this.props.children
  }
}
