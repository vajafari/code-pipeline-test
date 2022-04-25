import * as form from "acp/src/components/form"
import { EntityForm } from "acp/src/components/general-entity-form"
import { Routes } from "acp/src/constants/routes"
import { decodePrimitive } from "acp/src/helpers/backend/decoder"
import { getDifference } from "acp/src/helpers/get-difference"
import { useCurrentUserInfo } from "acp/src/helpers/hooks/use-current-user-info"
import {
  convertCognitoUserToFormFields,
  convertUserFormFieldsToCognito,
  getCognitoAdminAuthorized,
  getFieldsFromSchema,
} from "acp/src/helpers/user-entity-helper"
import { EntityCreate } from "acp/src/services/general-entity-service"
import { useRead, UserUpdate } from "acp/src/services/user-service"
import * as React from "react"
import { useSearchParam } from "react-use"
import { useLocation } from "wouter"

export const UserForm: React.FC<any> = (props: any) => {
  const [, setLocation] = useLocation()
  const user = useCurrentUserInfo()

  const searchParamSub = useSearchParam("sub")
  const sub = decodePrimitive(searchParamSub || "") as string

  const { data: readItem } = sub ? useRead(sub) : { data: undefined }
  const reading = Boolean(searchParamSub && !readItem)
  const editMode = Boolean(searchParamSub)
  const readItemConverted = convertCognitoUserToFormFields(readItem)

  const isViewableByUser = getCognitoAdminAuthorized("adminGetUser", user)

  const [isCreatableOrEditableByUser, setIsCreatableOrEditableByUser] = React.useState<boolean>(false)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (user && !isLoaded) {
      setIsCreatableOrEditableByUser(
        getCognitoAdminAuthorized(editMode ? "adminUpdateUserAttributes" : "adminCreateUser", user),
      )
      setIsLoaded(true)
    }
  }, [user, isLoaded])

  const handleSubmit: form.Generator["onSubmit"] = async (values) => {
    let result
    if (editMode)
      result = await UserUpdate(sub, convertUserFormFieldsToCognito(getDifference(readItemConverted, values)))
    else result = await EntityCreate("user", convertUserFormFieldsToCognito(values, true))
    if (!(result && result instanceof Error)) setLocation(Routes.UsersView)
  }

  return isLoaded ? (
    <EntityForm
      entityName={"user"}
      displayName={"User"}
      onSubmit={handleSubmit}
      isViewableByUser={isViewableByUser}
      isCreatableOrEditableByUser={isCreatableOrEditableByUser}
      formInitialValues={editMode ? readItemConverted : {}}
      formData={getFieldsFromSchema(!editMode)}
      editMode={editMode}
      reading={reading}
    />
  ) : null
}
