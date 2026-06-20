import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { BillView } from '../../types/bills.types'
import { Modal } from './Modal'

vi.mock('../../hooks/useIsMobile', () => ({ useIsMobile: () => false }))

const bill: BillView = {
  id: 'bill-99',
  billNo: '99',
  billType: 'Public',
  status: 'Current',
  sponsor: 'Minister Test',
  shortTitleEn: 'Climate Action Bill 2024',
  shortTitleGa: 'Bille um Ghníomhú ar son na hAeráide 2024',
  longTitleEn: 'A Bill to provide for the approval of plans for climate action.',
  longTitleGa:
    'Bille chun foráil a dhéanamh maidir le pleananna a fhormheas le haghaidh gníomhú ar son na haeráide.',
}

describe('Modal', () => {
  it.each([
    ['null bill', null, true],
    ['closed', bill, false],
  ])('renders nothing when %s', (_, b, open) => {
    const { container } = render(<Modal bill={b} open={open} onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('displays bill metadata and both language tabs', () => {
    render(<Modal bill={bill} open onClose={vi.fn()} />)
    for (const text of ['Climate Action Bill 2024', 'Bill No. 99', 'Public', 'Current'])
      expect(screen.getByText(text)).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'English' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Gaeilge' })).toBeInTheDocument()
    expect(screen.getByText(bill.longTitleEn)).toBeInTheDocument()
  })

  it('switches to Gaeilge tab and shows Irish title', async () => {
    render(<Modal bill={bill} open onClose={vi.fn()} />)
    await userEvent.setup().click(screen.getByRole('tab', { name: 'Gaeilge' }))
    expect(screen.getByText(bill.longTitleGa)).toBeInTheDocument()
  })

  it.each([
    ['English', 'longTitleEn' as keyof BillView, 'No English title available.'],
    ['Gaeilge', 'longTitleGa' as keyof BillView, 'Níl aon teideal Gaeilge ar fáil.'],
  ])('shows fallback when %s title is empty', async (_, field, fallback) => {
    render(<Modal bill={{ ...bill, [field]: '' }} open onClose={vi.fn()} />)
    if (field === 'longTitleGa')
      await userEvent.setup().click(screen.getByRole('tab', { name: 'Gaeilge' }))
    expect(screen.getByText(fallback)).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(<Modal bill={bill} open onClose={onClose} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
