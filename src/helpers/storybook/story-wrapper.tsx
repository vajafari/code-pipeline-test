/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import { makeStyles, Theme, useTheme } from "@material-ui/core"
import clsx from "clsx"
import * as React from "react"
import { GlobalStyles } from "acp/src/theme"

const useStyles = makeStyles({
  "@global": {
    "html, body, #root": {
      height: `100%`,
    },
  },
  root: (props: any) => ({
    display: `flex`,
    flexFlow: `column`,
    width: props.width || `100%`,
    height: props.height || `auto`,
    minHeight: props.minHeight || `100%`,
    background: props.background || `none`,
    alignItems: props.alignItems || `center`,
    justifyContent: props.justifyContent || `center`,
    margin: props.margin || 0,
  }),
})

export interface WrapperStory {
  children?: React.ReactNode
  className?: string
}
export const WrapperStory: React.FC<WrapperStory> = ({ children, className, ...props }) => {
  const classes = useStyles(props)
  const theme = useTheme()

  const setAuthTheme = (theme: Theme) => {
    const authThemeVars = [
      { variable: `amplify-primary-color`, value: theme.palette.primary.main },
      { variable: `amplify-primary-tint`, value: theme.palette.primary.light },
      { variable: `amplify-primary-shade`, value: theme.palette.primary.dark },
    ]
    for (const { variable, value } of authThemeVars) {
      document.documentElement.style.setProperty(`--${variable}`, value)
    }
  }

  React.useEffect(() => {
    setAuthTheme(theme)
  }, [])

  return (
    <GlobalStyles>
      <div className={clsx(classes.root, className)}>{children}</div>
    </GlobalStyles>
  )
}
