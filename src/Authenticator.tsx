import "@aws-amplify/ui/dist/style.css"
import * as React from "react"
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from "@aws-amplify/ui-react"
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components"
import { acpExports } from "acp/src/acp-exports"
import { useEffectOnce, useSearchParam } from "react-use"
import { Redirect } from "wouter"
import { Routes } from "acp/src/constants/routes"
import { isSignupDisabled } from "acp/src/helpers/user-entity-helper"

export const Authenticator = (): React.ReactElement => {
  const redirectUrl: string = useSearchParam("redirectUrl") || Routes.Landing
  const [authState, setAuthState] = React.useState<AuthState>()

  useEffectOnce(() => {
    return onAuthUIStateChange((nextAuthState) => {
      setAuthState(nextAuthState)
    })
  })

  return authState === AuthState.SignedIn ? (
    <Redirect to={redirectUrl} />
  ) : (
    <>
      <AmplifyAuthenticator usernameAlias="email">
        <AmplifySignIn slot="sign-in" hideSignUp={isSignupDisabled()} />
        <AmplifySignUp
          slot="sign-up"
          usernameAlias="email"
          formFields={[
            ...acpExports.signUpFields.map((field) => ({
              type: field.Name,
              label: `${field.Label}${field.Required ? ` *` : ``}`,
              placeholder: field.Placeholder,
              required: field.Required,
            })),
            { type: `password`, required: true },
          ]}
        />
      </AmplifyAuthenticator>
    </>
  )
}
