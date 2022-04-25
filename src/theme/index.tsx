import { createMuiTheme, CssBaseline, makeStyles, MuiThemeProvider } from "@material-ui/core"
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme"
import { TypographyOptions } from "@material-ui/core/styles/createTypography"
import * as React from "react"

import { setPalette } from "./options/palette"
import { setTypography } from "./options/typography"

interface setTheme {
  typography: TypographyOptions
  palette: ThemeOptions["palette"]
}
const setTheme = (overrides?: setTheme) => {
  const palette = setPalette(overrides?.palette)
  const typography = setTypography(overrides?.typography)

  return createMuiTheme({
    palette,
    typography,
    overrides: {
      MuiSvgIcon: {
        root: {
          "& path": { fill: `inherit` }, // SVG icons from Figma prohibit setting a color through SvgIcon
        },
      },
      MuiMenu: {
        paper: {
          borderRadius: 8,
          boxShadow: `0px 4px 30px rgba(0, 0, 0, 0.12)`,
        },
        list: {
          padding: `12px 0`,
        },
      },
      MuiMenuItem: {
        gutters: {
          padding: `12px 24px`,
        },
      },
      MuiButton: {
        root: {
          minWidth: 133,
          minHeight: 34,
          borderRadius: 0,
          ...typography.button,
        },
        label: {
          alignItems: `flex-end`,
        },
        sizeSmall: {
          minWidth: 108,
          minHeight: 28,
          ...typography.button,
        },
        sizeLarge: {
          minWidth: 208,
          minHeight: 40,
          ...typography.button,
        },
        iconSizeSmall: {
          marginLeft: 0,
        },
        iconSizeMedium: {
          marginLeft: 5,
          "&> *:first-child": {
            fontSize: 16,
          },
        },
        iconSizeLarge: {
          "&> *:first-child": {
            fontSize: 16,
          },
        },
        contained: {
          boxShadow: `none`,

          "&:hover, &:active": {
            boxShadow: `none`,
          },
        },
      },
      MuiDialog: {
        paper: {
          width: 705,
        },
      },
      MuiDialogTitle: {
        root: {
          ...typography.h4,
          padding: `40px 40px 0`,
        },
      },
      MuiDialogContentText: {
        root: {
          ...typography.body1,
        },
      },
      MuiDialogActions: {
        root: {
          justifyContent: `center`,
          padding: `4px 40px 40px`,

          "& > *": {
            flexGrow: 1,
          },
        },
        spacing: {
          "&> :not(:first-child)": {
            marginLeft: 25,
          },
        },
      },
      MuiTooltip: {
        tooltip: {
          backgroundColor: palette?.grey?.[100],
          color: `white`,
          borderRadius: 5,
          padding: 8,
          maxWidth: 250,
          ...typography.caption,
        },
        arrow: {
          color: palette?.grey?.[100],
        },
      },
    },
    props: {
      MuiDialogTitle: {
        disableTypography: true,
      },
      MuiTooltip: {
        arrow: true,
      },
    },
  })
}
type theme = ReturnType<typeof setTheme>

const useStyles = makeStyles({
  "@global": {
    "html,body": {
      height: `100%`,
      width: `100%`,
      overscrollBehavior: `none`,
    },
    a: {
      textDecoration: `none`,
      color: (theme: theme) => theme.palette.primary.main,
    },
    'input[type="email"]': {
      textTransform: `lowercase`,
    },
  },
})

interface GlobalStyles {
  children: React.ReactNode
}
/**
 * MuiThemeProvider @see https://material-ui.com/customization/themes/#muithemeprovider
 * CssBaseline @see https://material-ui.com/style/css-baseline/
 */
export const GlobalStyles = React.memo((props: GlobalStyles) => {
  const theme = setTheme()

  /** Amplify theme */
  const authThemeVars = [
    { variable: `amplify-primary-color`, value: theme.palette.primary.main },
    { variable: `amplify-primary-tint`, value: theme.palette.primary.light },
    { variable: `amplify-primary-shade`, value: theme.palette.primary.dark },
  ]
  for (const { variable, value } of authThemeVars) {
    document.documentElement.style.setProperty(`--${variable}`, value)
  }

  useStyles(theme)

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

      {props.children}
    </MuiThemeProvider>
  )
})

GlobalStyles.displayName = "GlobalStyles"
