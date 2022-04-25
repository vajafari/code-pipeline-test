import { makeStyles } from "@material-ui/core"
/**
 * @see https://material-ui.com/api/outlined-input/#css
 */
export const useStyles = makeStyles((theme) => ({
  root: {
    display: `flex`,
    flexWrap: `wrap`,
  },
  chip: {
    margin: theme.spacing(0.25),
  },
  iconButton: {
    position: `absolute`,
    right: 4,
  },
  menu: {
    width: 300,
  },
}))
