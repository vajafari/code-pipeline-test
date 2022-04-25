import Amplify from "@aws-amplify/core"
import { Authenticator } from "acp/src/Authenticator"
import awsExports from "acp/src/aws-exports"
import { Routes } from "acp/src/constants/routes"
import { Dashboard } from "acp/src/Dashboard"
import { Layout } from "acp/src/Layout"
import { ProtectedRoute } from "acp/src/ProtectedRoute"
import { GlobalStyles } from "acp/src/theme"
import { SnackbarProvider } from "notistack"
import * as React from "react"
import { Route, Switch } from "wouter"

Amplify.configure(awsExports)

const App = (): React.ReactElement => {
  return (
    <GlobalStyles>
      <SnackbarProvider preventDuplicate maxSnack={5}>
        <Switch>
          <Route path={Routes.Auth(false)} component={Authenticator} />
          <ProtectedRoute path={Routes.Dashboard} component={Dashboard} />
          <ProtectedRoute path={Routes.UsersView} component={Dashboard} />
          <ProtectedRoute path={Routes.UserCreate} component={Dashboard} />
          <ProtectedRoute path={Routes.UserEdit()} component={Dashboard} />
          <ProtectedRoute path={Routes.EntityView()} component={Dashboard} />
          <ProtectedRoute path={Routes.EntityCreate()} component={Dashboard} />
          <ProtectedRoute path={Routes.EntityEdit()} component={Dashboard} />
          <Route path={Routes.Landing} component={Layout} />
        </Switch>
      </SnackbarProvider>
    </GlobalStyles>
  )
}

export default App
