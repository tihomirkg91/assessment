// Oireachtas API (raw response)
export interface BillApiResponse {
  head: {
    counts: {
      billCount: number
      resultCount: number
    }
  }
  results: BillResult[]
}

export interface BillResult {
  bill: Bill
}

export interface Bill {
  billNo: string
  billType: string
  billYear: string
  status: string
  shortTitleEn: string
  shortTitleGa: string
  longTitleEn: string
  longTitleGa: string
  sponsors: SponsorWrapper[]
  uri: string
}

export interface SponsorWrapper {
  sponsor: {
    isPrimary: boolean
    as: { showAs: string | null; uri: string | null }
    by: { showAs: string | null; uri: string | null }
  }
}

export interface BillView {
  id: string
  billNo: string
  billType: string
  status: string
  sponsor: string
  shortTitleEn: string
  shortTitleGa: string
  longTitleEn: string
  longTitleGa: string
}

export type BillType = 'Public' | 'Private' | 'Hybrid' | 'Committee'
