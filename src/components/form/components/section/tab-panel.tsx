import * as React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

export interface useStyles {
  height: number
}
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      overflowY: "scroll",
      width: "90%",
      height: ({ height }: useStyles) => height,
      padding: theme.spacing(1),
    },
  }),
)

export interface TabPanel {
  className?: string
  children: any
  index: number
  value: number
  tabContainerHeight?: number
}

export const TabPanel = (props: TabPanel): React.ReactElement => {
  const { children, value, index, className, tabContainerHeight = 500, ...other } = props
  const classes = useStyles({ height: tabContainerHeight })

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className={classes.container}
      {...other}
    >
      {value === index && <div className={className}>{children}</div>}
    </div>
  )
}
