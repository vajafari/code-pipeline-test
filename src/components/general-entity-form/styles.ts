import { createStyles, makeStyles } from "@material-ui/core/styles"

export const useStyles = makeStyles((theme) =>
  createStyles({
    form: {
      display: `flex`,
      flexDirection: `column`,
      justifyContent: `center`,
      width: "50%",
    },
    header: {
      width: "50%",
      marginBottom: theme.spacing(2),
    },
    fields: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
)
