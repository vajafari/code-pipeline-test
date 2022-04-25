import { MutableRefObject, RefObject, useEffect, useState } from "react"

const initialValue = {
  intersectionRatio: 0,
}

export const useIntersection = (
  ref: MutableRefObject<HTMLAnchorElement | undefined> | RefObject<HTMLElement>, //RefObject<HTMLElement>
  options: IntersectionObserverInit,
): IntersectionObserverEntry | null => {
  const [intersectionObserverEntry, setIntersectionObserverEntry] = useState<IntersectionObserverEntry | null>(
    initialValue as IntersectionObserverEntry,
  )

  useEffect(() => {
    if (ref.current && typeof IntersectionObserver === `function`) {
      const handler = (entries: IntersectionObserverEntry[]) => {
        setIntersectionObserverEntry(entries[entries.length - 1])
      }

      const observer = new IntersectionObserver(handler, options)
      observer.observe(ref.current)

      return () => {
        setIntersectionObserverEntry(initialValue as IntersectionObserverEntry)
        observer.disconnect()
      }
    }
    return () => ({}) //{}
  }, [ref.current, options.threshold, options.root, options.rootMargin])

  return intersectionObserverEntry
}
