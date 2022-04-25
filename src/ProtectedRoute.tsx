import * as React from "react"
import { Auth } from "@aws-amplify/auth"
import { Redirect, Route, RouteProps, Router } from "wouter"
import { useMount, useEffectOnce } from "react-use"
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components"
import { CircularLoadingProgress } from "acp/src/components/loading-progress/circular-loading-progress"
import { Routes } from "acp/src/constants/routes"

export const ProtectedRoute = (props: RouteProps): React.ReactElement => {
  const [authState, setAuthState] = React.useState<AuthState | undefined>()

  useEffectOnce(() => {
    return onAuthUIStateChange((nextAuthState) => {
      setAuthState(nextAuthState)
    })
  })

  useMount(() => {
    async function readCurrentUserInfo() {
      try {
        if (authState !== AuthState.SignedIn) {
          const result = await Auth.currentUserInfo()
          if (result) {
            setAuthState(AuthState.SignedIn)
          } else setAuthState(AuthState.SignedOut)
        }
      } catch (err) {}
    }

    void readCurrentUserInfo()
  })

  if (!authState) return <CircularLoadingProgress />
  else if (authState === AuthState.SignedIn) return <Route {...props} />
  else
    return (
      <Router base={""}>
        <Redirect to={Routes.Auth()} />
      </Router>
    )
}
