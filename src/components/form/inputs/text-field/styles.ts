import { makeStyles } from "@material-ui/core"

export interface useStyles {
  hideBorder: boolean
}
/**
 * @see https://material-ui.com/api/outlined-input/#css
 */
export const useStyles = makeStyles((theme) => ({
  root: {
    "& input[aria-invalid=true] + fieldset": {
      borderColor: `${theme.palette.grey[100]} !important`,
    },

    "& legend": {
      display: `none`,
    },
  },
  InputLabelRoot: {
    position: `relative`,
    transform: `none !important`,
    color: `${theme.palette.text.primary} !important`,
    margin: theme.spacing(0, 0, 0.5),
    ...theme.typography.overline,
  },
  InputRoot: {
    minWidth: 300,
    minHeight: 42,
    borderRadius: 0,
    ...theme.typography.body2,
    "&$focused": {
      "& svg": {
        color: theme.palette.primary.main,
        "& path": {
          fill: theme.palette.primary.main,
        },
      },
    },
  },
  InputMarginDense: {
    minHeight: 32,
    borderRadius: 100,
    background: theme.palette.grey[400],
    "& fieldset": {
      borderColor: theme.palette.grey[200],
    },
  },
  InputInput: {
    padding: `12.75px 16px`,
  },
  InputInputMarginDense: {
    padding: `7.75px 16px`,
  },
  InputNotchedOutline: {
    top: 0,
    borderColor: theme.palette.grey[100],
    borderWidth: ({ hideBorder }: useStyles) => `${hideBorder ? 0 : 1}px !important`,
  },
  InputInputAdornedStart: {
    padding: `12.75px 16px 12.75px 0`,
  },
  InputAdornedStart: {
    paddingLeft: theme.spacing(2),

    "& svg": {
      width: 16,
      height: 16,
      marginRight: theme.spacing(1.5),

      "& path": {
        fill: theme.palette.grey[100],
      },
    },
  },
  InputAdornedEnd: {
    "& svg": {
      marginRight: 0,
      "& path": {
        fill: theme.palette.grey[100],
      },
    },
  },
  FormHelperTextRoot: {
    margin: theme.spacing(0.75, 0, 0),
  },
  focused: {
    backgroundColor: `initial !important`,
  },
}))
