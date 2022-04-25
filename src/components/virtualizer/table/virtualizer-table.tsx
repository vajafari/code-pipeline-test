/**
 * We don't use Material-UI components: Table, TableHead, TableBody, etc.
 * as they don't contain any styles we use and come with noticeable rendering expense
 */
import clsx from "clsx"
import * as CSS from "csstype"
import * as React from "react"
import { useRefVirtualizer, Virtualizer } from "acp/src/components/virtualizer"

import TableHeadCell from "./head-cell"
import { useStyles } from "./styles"

export type render = (row: any, column: string) => JSX.Element | any
interface Data {
  [key: string]: any
}
export interface Column {
  label?: string
  accessor?: string
  render?: render
}

export const extractCellValue = (column: Column, data: Data[], index: number): any => {
  if (column.accessor)
    return !column.render ? data[index][column.accessor] : column.render(data[index], column.accessor)
}

export interface VirtualizerTable<Row = Data> {
  columns: Column[]
  data: Row[]
  VirtualizerProps?: Pick<Virtualizer, "loadMore" | "nextPage" | "disableLoadMore">
  className?: string
  rowRender?: (row: any, isLastRow: boolean) => JSX.Element | any
  hideHeader?: boolean
  hideBorder?: boolean
  disableHighlight?: boolean
  alignItems?: CSS.Property.AlignItems
  justifyContent?: CSS.Property.JustifyContent
}
export const VirtualizerTable = React.memo(({ data = [], ...props }: VirtualizerTable) => {
  const classes = useStyles({
    alignItems: props.alignItems || `center`,
    justifyContent: props.justifyContent || `flex-start`,
    hideBorder: props.hideBorder || false,
  })
  const { parentRef, refCallback } = useRefVirtualizer()
  const columnsWidths = React.useRef<any>({})
  const setColumnWidth = React.useCallback((index, size) => {
    columnsWidths.current[index] = size
  }, [])
  const children: Virtualizer["row"]["children"] = React.useCallback(
    (index: number) =>
      props.columns.map((column, columnIdx) => (
        <div
          key={`${index}${columnIdx}${column.accessor}`}
          className={clsx(classes.cell, classes.bodyCell)}
          {...(!props.hideHeader && {
            style: { width: columnsWidths.current[columnIdx] },
          })}
        >
          {extractCellValue(column, data, index)}
        </div>
      )),
    [data, props.columns, classes.bodyCell, classes.cell, props.hideHeader],
  )

  return (
    <div className={clsx(classes.table, props.className)}>
      {!props.hideHeader && (
        <div className={clsx(classes.headRow, !props.disableHighlight && classes.rowHighlighted)}>
          {props.columns.map((column, columnIdx) => (
            <TableHeadCell
              key={`${column.accessor}${columnIdx}`}
              index={columnIdx}
              setColumnWidth={setColumnWidth}
              className={clsx(classes.cell, classes.headCell)}
            >
              {column.label}
            </TableHeadCell>
          ))}
        </div>
      )}

      <div className={classes.body} ref={refCallback}>
        {parentRef && (
          <Virtualizer
            dynamicRowHeight
            parentRef={parentRef}
            numOfRows={data.length}
            row={{
              children,
              className: classes.bodyRow,
              classNameEven: !props.disableHighlight ? classes.rowHighlighted : undefined,
            }}
            {...props.VirtualizerProps}
          />
        )}
      </div>
    </div>
  )
})
