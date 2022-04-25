import * as React from "react"
import { Box, makeStyles } from "@material-ui/core"
import { Header } from "acp/src/components/dashboard/header"
import { useCurrentUserInfo } from "acp/src/helpers/hooks/use-current-user-info"
import { Menus } from "acp/src/components/dashboard/menus"
import { useAuthorizedEntities } from "acp/src/helpers/hooks/use-entity"
import { getCognitoAdminAuthorized } from "acp/src/helpers/user-entity-helper"
import SnackbarNotificationComponent from "acp/src/components/notification/SnackbarNotificationComponent"
import { GeneralEntityView } from "acp/src/components/general-entity-view"
import { GeneralEntityForm } from "acp/src/components/general-entity-form"
import { UsersView } from "acp/src/components/users/users-view"
import { UserForm } from "acp/src/components/users/user-form"
import { Switch } from "wouter"
import { Routes } from "acp/src/constants/routes"
import { ProtectedRoute } from "acp/src/ProtectedRoute"

const useStyles = makeStyles({
  "@global": {
    "#root": {
      minHeight: `100%`,
      display: `flex`,
      flexFlow: `column`,
      minWidth: `100%`,
    },
  },
  main: {
    display: `flex`,
    flex: `1 0`,
    flexFlow: `column`,
  },
})

export const Dashboard = (): React.ReactElement => {
  const classes = useStyles()
  const user = useCurrentUserInfo()
  const menus = [
    ...useAuthorizedEntities("GET", user),
    ...(getCognitoAdminAuthorized("listUsers", user)
      ? [
          {
            entityName: "user",
            displayName: "User",
            icon: "Person",
            displayOrder: 0,
          },
        ]
      : []),
  ]

  const [openMenu, setOpenMenu] = React.useState(false)

  const handleToggleDrawerMenu = (open: boolean) => (event: any) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return
    }
    setOpenMenu(open)
  }

  return (
    <>
      <SnackbarNotificationComponent />
      <Header username={user?.attributes?.email} onToggleDrawerMenu={handleToggleDrawerMenu} />
      <Menus open={openMenu} menus={menus} onToggleDrawerMenu={handleToggleDrawerMenu} />
      <Box className={classes.main} component="main">
        <Switch>
          <ProtectedRoute path={Routes.UsersView} component={UsersView} />
          <ProtectedRoute path={Routes.UserCreate} component={UserForm} />
          <ProtectedRoute path={Routes.UserEdit()} component={UserForm} />
          <ProtectedRoute path={Routes.EntityView()} component={GeneralEntityView} />
          <ProtectedRoute path={Routes.EntityCreate()} component={GeneralEntityForm} />
          <ProtectedRoute path={Routes.EntityEdit()} component={GeneralEntityForm} />
        </Switch>
      </Box>
    </>
  )
}
