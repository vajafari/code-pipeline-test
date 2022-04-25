import React, { RefObject } from "react"
import { Virtualizer } from "acp/src/components/virtualizer"

interface refVirtualizer {
  parentRef: React.MutableRefObject<HTMLElement> | undefined
  refCallback: string | ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined
}
export const useRefVirtualizer = (): refVirtualizer => {
  const [parentRef, setParentRef] = React.useState<Virtualizer["parentRef"]>()
  const refCallback = React.useCallback((node) => {
    setParentRef({ current: node })
  }, [])

  return { parentRef, refCallback }
}
