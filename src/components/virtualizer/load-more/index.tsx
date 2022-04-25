import { Button, ButtonProps, makeStyles } from "@material-ui/core"
import clsx from "clsx"
import * as React from "react"
import { useMountedState, useUnmount } from "react-use"

import { useIntersection } from "./use-intersection"

const useStyles = makeStyles({
  btnLoadMore: { zIndex: -1 }, // btn should be below other items by default
})
/**
 * has to be outside of LoadMore component, as this component gets mounted & unmounted, so ref is always clean on remount
 */
let refLoadedPages: { [key: string]: true } = {}

export interface LoadMore extends Omit<ButtonProps, "onClick" | "to" | "innerRef"> {
  loadMore: () => void
  nextPage: string
  maxHeight: number
}
export const LoadMore = React.memo(({ loadMore, nextPage, className, disabled, maxHeight, ...props }: LoadMore) => {
  const classes = useStyles()
  const checkMountState = useMountedState()
  const refIntersection = React.useRef<HTMLAnchorElement>()
  const intersection = useIntersection(refIntersection, { threshold: 0.01 })

  React.useEffect(() => {
    const isVisible = intersection?.intersectionRatio && intersection?.intersectionRatio > 0
    const isMounted = checkMountState()
    const isClicked = refLoadedPages[nextPage]
    if (isVisible && isMounted && loadMore && !isClicked && !disabled) {
      refLoadedPages[nextPage] = true
      loadMore()
    }
  }, [intersection?.intersectionRatio, loadMore, disabled, checkMountState, nextPage])

  useUnmount(() => {
    refLoadedPages = {}
  })

  return (
    <Button
      className={clsx(classes.btnLoadMore, className)}
      innerRef={refIntersection}
      onClick={loadMore}
      style={{ maxHeight }} // maxHeight should be inline style as otherwise it's inconsistent
      {...props}
    />
  )
})
