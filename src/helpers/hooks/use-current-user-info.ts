import * as React from "react"
import { CognitoUserInterface } from "@aws-amplify/ui-components"
import { Auth } from "@aws-amplify/auth"
import { useMount } from "react-use"

export interface UserData extends CognitoUserInterface {
  attributes: {
    email: string
    sub: string
    name?: string
    family_name?: string
    email_verified: boolean
  }
  groups?: string[]
}

const readUserAndGroups = async (setPermissions: React.Dispatch<UserData>, bypassCache: boolean) => {
  const currentUser = await Auth.currentAuthenticatedUser({ bypassCache })

  if (currentUser) {
    const groups: UserData["groups"] = currentUser.signInUserSession.accessToken.payload[`cognito:groups`]
    const stateNew: UserData = {
      ...currentUser,
      groups,
    }
    setPermissions(stateNew)
  }
}

export const useCurrentUserInfo = (bypassCache = false): UserData | undefined => {
  const [user, setUser] = React.useState<UserData | undefined>()

  useMount(() => {
    void readUserAndGroups(setUser, bypassCache)
  })
  return user
}
