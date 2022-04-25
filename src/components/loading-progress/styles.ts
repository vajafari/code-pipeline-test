import { createStyles, makeStyles } from "@material-ui/core/styles"

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      height: "100%",
      position: "fixed",
      top: 0,
      left: 0,
    },
    container: {
      margin: "auto",
    },
  }),
)
