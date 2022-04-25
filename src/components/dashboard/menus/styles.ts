import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      paddingTop: theme.spacing(7),
      minWidth: 250,
    },
  }),
)
