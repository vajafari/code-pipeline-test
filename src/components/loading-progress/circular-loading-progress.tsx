import * as React from "react"
import { CircularProgress, CircularProgressProps } from "@material-ui/core"
import { useStyles } from "./styles"

export type CircularLoadingProgressProps = Omit<CircularProgressProps, "variant">

export const CircularLoadingProgress = (props: CircularLoadingProgressProps): React.ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <CircularProgress variant="indeterminate" {...props} />
      </div>
    </div>
  )
}
