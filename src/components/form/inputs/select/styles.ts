import { makeStyles } from "@material-ui/core"
/**
 * @see https://material-ui.com/api/outlined-input/#css
 */
export const useStyles = makeStyles((theme) => ({
  InputAdornedEndRequired: {
    position: `absolute`,
    right: 30,
  },
  menuItem: {
    ...theme.typography.overline,
  },
}))
