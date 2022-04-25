import * as React from "react"
import { Toolbar, AppBar, IconButton, Typography } from "@material-ui/core"
import { AmplifySignOut } from "@aws-amplify/ui-react"
import MenuIcon from "@material-ui/icons/Menu"

import * as Styled from "./styles"

export interface HeaderProps {
  username?: string
  onSignOut?: () => void
  onToggleDrawerMenu: (open: boolean) => (event: any) => void
}

export const Header = (props: HeaderProps): React.ReactElement => {
  const classes = Styled.useStyles()
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={props?.onToggleDrawerMenu(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Dashboard - {props.username || "Guest"}
        </Typography>
        {props.username && <AmplifySignOut onClick={props?.onSignOut} />}
      </Toolbar>
    </AppBar>
  )
}
