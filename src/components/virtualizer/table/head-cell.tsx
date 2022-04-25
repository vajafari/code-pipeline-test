import * as React from "react"
import { useWindowSize } from "react-use"

interface TableHeadCell extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  setColumnWidth: (index?: number, height?: number) => void
}
const TableHeadCell = React.memo(({ index, setColumnWidth, ...props }: TableHeadCell) => {
  const { width } = useWindowSize()
  // const refTableHeadCell = React.useRef<HTMLDivElement>()
  const refTableHeadCell = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setColumnWidth(index, refTableHeadCell.current?.getBoundingClientRect().width)
  }, [index, setColumnWidth, width])

  return <div ref={refTableHeadCell} {...props} />
})

TableHeadCell.displayName = "TableHeadCell"
export default TableHeadCell
