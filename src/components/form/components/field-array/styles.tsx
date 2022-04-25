import { makeStyles } from "@material-ui/core"

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: `flex`,
    flexDirection: `column`,
  },
  row: {
    display: `flex`,
    alignItems: `center`,
    margin: theme.spacing(0, 0, 2),
  },
  field: {
    flexGrow: 1,
    margin: theme.spacing(0, 1.5, 0, 0),
  },
  buttonIcon: {
    "& path": {
      fill: theme.palette.grey[100],
    },
  },
  textBtnWrapper: {
    cursor: `pointer`,
    display: `flex`,
    alignItems: `center`,
    margin: theme.spacing(0, 0, 2.25),
  },
  addIcon: {
    width: 16,
    height: 16,
    margin: theme.spacing(0, 1, 0, 0),
    "& circle": {
      fill: theme.palette.primary.main,
    },
    "& path": {
      fill: theme.palette.primary.contrastText,
    },
  },
}))
