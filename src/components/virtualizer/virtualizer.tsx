import { makeStyles } from "@material-ui/core"
import clsx from "clsx"
import * as React from "react"
import { useWindowSize } from "react-use"
import { useVirtual, VirtualItem } from "react-virtual"
import { LoadMore } from "./load-more"
import { defaultRowHeight } from "./table/styles"

const triggerFromBottom = 900

const useStyles = makeStyles({
  wrapper: {
    position: `absolute`,
    top: 0,
    left: 0,
    width: `100%`,
  },
  loadMore: {
    position: `absolute`,
    bottom: 0,
    left: 0,
    height: triggerFromBottom,
  },
})

export interface Virtualizer {
  parentRef: React.MutableRefObject<HTMLElement>
  numOfRows: number
  row: {
    children: (index: number) => JSX.Element | JSX.Element[]
    height?: number
    className?: string
    classNameEven?: string
  }
  className?: string
  loadMore?: LoadMore["loadMore"]
  nextPage?: LoadMore["nextPage"]
  disableLoadMore?: boolean
  dynamicRowHeight?: boolean // see https://codesandbox.io/s/github/tannerlinsley/react-virtual/tree/master/examples/dynamic
}
export const Virtualizer = React.memo((props: Virtualizer) => {
  const classes = useStyles()
  const { width, height } = useWindowSize()
  const estimateSize = React.useCallback(() => props.row.height || defaultRowHeight, [props.row.height])
  const rowVirtualizer = useVirtual({
    size: props.numOfRows,
    parentRef: props.parentRef,
    estimateSize,
  })
  const renderRow = React.useCallback(
    (virtualRow: VirtualItem) => {
      if (typeof virtualRow.index !== `number`) return null

      return (
        <div
          key={virtualRow.index}
          ref={props.dynamicRowHeight ? virtualRow.measureRef : undefined}
          className={clsx(classes.wrapper, props.row.className, virtualRow.index % 2 && props.row.classNameEven)}
          style={{
            transform: `translateY(${virtualRow.start}px)`,
            ...(props.dynamicRowHeight ? { height: virtualRow.size } : { height: props.row.height }),
          }}
        >
          {props.row.children(virtualRow.index)}
        </div>
      )
    },
    // //eslint-disable-next-line react-hooks/exhaustive-deps
    [classes.wrapper, props.row, width, height],
  )

  return (
    <div className={clsx(classes.wrapper, props.className)} style={{ height: rowVirtualizer.totalSize }}>
      {rowVirtualizer.virtualItems.map(renderRow)}
      {props.loadMore && (
        <LoadMore
          className={classes.loadMore}
          disabled={props.disableLoadMore}
          loadMore={props.loadMore}
          nextPage={props.nextPage || ""}
          maxHeight={props.parentRef.current.clientHeight}
        />
      )}
    </div>
  )
})
