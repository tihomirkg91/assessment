import type { RefObject } from 'react'
import type { BillResult, BillView } from '../types/bills.types'

const FALLBACK_TYPES = ['Public', 'Private', 'Hybrid', 'Committee'] as const
const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim()

export const toBillView = ({ bill }: BillResult): BillView => {
  const primary = bill.sponsors?.find((s) => s.sponsor.isPrimary)?.sponsor

  return {
    id: `${bill.billYear}-${bill.billNo}`,
    billNo: bill.billNo,
    billType: bill.billType,
    status: bill.status,
    sponsor: primary?.as?.showAs ?? primary?.by?.showAs ?? '—',
    shortTitleEn: bill.shortTitleEn,
    shortTitleGa: bill.shortTitleGa,
    longTitleEn: stripHtml(bill.longTitleEn),
    longTitleGa: stripHtml(bill.longTitleGa),
  }
}

export const extractBillTypes = (results: BillResult[]): string[] => {
  const types = [...new Set(results.map((r) => r.bill.billType).filter(Boolean))]

  return types.length > 0 ? types.sort() : [...FALLBACK_TYPES]
}

// Sync scroll between header and body of a table
export const syncScroll = (
  source: 'header' | 'body',
  headerRef: RefObject<HTMLDivElement | null>,
  bodyRef: RefObject<HTMLDivElement | null>,
) => {
  const header = headerRef.current
  const body = bodyRef.current
  if (!header || !body) return

  if (source === 'header') {
    if (body.scrollLeft !== header.scrollLeft) body.scrollLeft = header.scrollLeft
  } else {
    if (header.scrollLeft !== body.scrollLeft) header.scrollLeft = body.scrollLeft
  }
}
