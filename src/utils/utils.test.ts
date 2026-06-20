import { describe, expect, it } from 'vitest'
import type { BillResult } from '../types/bills.types'
import { extractBillTypes, toBillView } from './utils'

const makeResult = (overrides: Partial<BillResult['bill']> = {}): BillResult => ({
  bill: {
    billNo: '42',
    billType: 'Public',
    billYear: '2024',
    status: 'Current',
    shortTitleEn: 'Test Bill',
    shortTitleGa: 'Bille Tástála',
    longTitleEn: 'A <i>Bill</i> to test things.',
    longTitleGa: 'Bille chun <b>rudaí</b> a thástáil.',
    uri: '/test',
    sponsors: [
      {
        sponsor: {
          isPrimary: true,
          as: { showAs: 'Minister Test', uri: '/m/test' },
          by: { showAs: 'Dept. Test', uri: '/d/test' },
        },
      },
    ],
    ...overrides,
  },
})

describe('toBillView', () => {
  it('maps all fields and strips HTML', () => {
    const view = toBillView(makeResult())
    expect(view).toEqual({
      id: '2024-42',
      billNo: '42',
      billType: 'Public',
      status: 'Current',
      sponsor: 'Minister Test',
      shortTitleEn: 'Test Bill',
      shortTitleGa: 'Bille Tástála',
      longTitleEn: 'A Bill to test things.',
      longTitleGa: 'Bille chun rudaí a thástáil.',
    })
  })

  it('falls back sponsor: as.showAs → by.showAs → —', () => {
    const bill = { ...makeResult().bill }
    const sponsor = bill.sponsors[0]?.sponsor
    if (!sponsor) throw new Error('Expected sponsor')

    sponsor.as = { showAs: null, uri: null }
    sponsor.by = { showAs: 'ByFallback', uri: null }
    expect(toBillView({ bill }).sponsor).toBe('ByFallback')

    sponsor.by = { showAs: null, uri: null }
    expect(toBillView({ bill }).sponsor).toBe('—')
  })
})

describe('extractBillTypes', () => {
  it('returns sorted unique types', () => {
    const results = [
      makeResult({ billType: 'Private' }),
      makeResult({ billType: 'Public' }),
      makeResult({ billType: 'Public' }),
    ]
    expect(extractBillTypes(results)).toEqual(['Private', 'Public'])
  })

  it('returns fallback types when empty', () => {
    expect(extractBillTypes([])).toEqual(['Public', 'Private', 'Hybrid', 'Committee'])
  })
})
