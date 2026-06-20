import { useRef } from 'react'
import { syncScroll } from '../utils/utils'

// Synchronizes horizontal scroll between a sticky header and a scrollable body
export const useScrollSync = () => {
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const onHeaderScroll = () => syncScroll('header', headerRef, bodyRef)
  const onBodyScroll = () => syncScroll('body', headerRef, bodyRef)

  return { headerRef, bodyRef, onHeaderScroll, onBodyScroll } as const
}
