import { makeStyles, Theme } from "@material-ui/core/styles"
import { CSSProperties } from "@material-ui/core/styles/withStyles"
import * as CSS from "csstype"

export const defaultRowHeight = 60
export const setBodyRowStyle = (top: string | number, isEven: number, shade: string): CSSProperties => ({
  top,
  ...(isEven && { background: shade }),
})

export interface useStyles {
  alignItems: CSS.Property.AlignItems
  justifyContent: CSS.Property.JustifyContent
  hideBorder: boolean
}
export const useStyles = makeStyles((theme: Theme) => {
  const borderStyle = `1px solid ${theme.palette.grey[300]}`
  return {
    table: {
      display: `flex`,
      flexFlow: `column`,
      flex: 1,
      width: `100%`,
      border: ({ hideBorder }: useStyles) => (!hideBorder ? borderStyle : 0),
    },
    headRow: {
      display: `table`,
      width: `100%`,
    },
    headCell: {
      ...theme.typography.overline,
      padding: `7px ${theme.spacing(2)}px 9px`,
      display: `table-cell`,
    },
    body: {
      flex: 1,
      position: `relative`,
      overflowY: `scroll`,
    },
    bodyRow: {
      display: `flex`,
    },
    bodyCell: ({ justifyContent, alignItems }: useStyles) => ({
      ...theme.typography.body1,
      padding: `8px ${theme.spacing(2)}px 10px`,
      display: `inline-flex`,
      justifyContent,
      alignItems,
    }),
    cell: {
      whiteSpace: `pre-line`,
      wordBreak: `break-all`,
    },
    rowHighlighted: {
      background: theme.palette.grey[400],
    },
  }
})
