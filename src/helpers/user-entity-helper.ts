import { CognitoUserInterface } from "@aws-amplify/ui-components"
import _ from "lodash"
import * as configs from "acp/acp-config.json"
import { isUserAuthorized } from "acp/src/helpers/general-entity-helper"
import { UserData } from "acp/src/helpers/hooks/use-current-user-info"
import { CognitoUserPoolAuthConfigSchemaProperties, CognitoUserPoolProperties } from "acp/src/acp-exports"
import * as form from "acp/src/components/form"
import { ColumnType } from "acp/src/components/general-entity-view"

export const getCognitoAdminAuthorized = (
  actionName: cognitoAdminApiSecuritySettingAction,
  user?: UserData,
): boolean => {
  const cognitoAdminApiSecuritySetting = configs.authConfig.cognitoAdminApiSecuritySetting[
    actionName
  ] as AuthorizationType
  return isUserAuthorized(cognitoAdminApiSecuritySetting, user)
}

export const getTableColumns = (): ColumnType[] => {
  return [
    ...(configs.authConfig.userPoolProperties.Schema as CognitoUserPoolAuthConfigSchemaProperties[]).map((field) => ({
      label: field.Label || field.Name,
      accessor: field.Name,
      render: (user: CognitoUserInterface) => {
        const { Attributes } = user
        return Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === field.Name)?.Value
      },
    })),
    {
      label: "Status",
      accessor: "UserStatus",
    },
    {
      label: "Enabled",
      accessor: "Enabled",
      render: (user: CognitoUserInterface) => {
        return user.Enabled ? "Enabled" : "Disabled"
      },
    },
  ]
}

export const getFieldsFromSchema = (createMode: boolean): form.Generator["fields"] => {
  const schema = configs.authConfig.userPoolProperties.Schema as CognitoUserPoolAuthConfigSchemaProperties[]
  const formFields = schema.map((signupField) => ({
    name: signupField.Name,
    label: signupField.Label,
    component: form.fieldType.TextField,
    componentProps: {
      required: signupField.Required,
      disabled: !createMode && !signupField.Mutable,
      placeholder: signupField.Placeholder,
      type: signupField.AttributeDataType.toLowerCase(),
    },
  }))
  if (createMode) {
    formFields.push({
      name: "temporaryPassword",
      label: "Password",
      component: form.fieldType.TextField,
      componentProps: {
        required: true,
        placeholder: "Enter your password",
        disabled: false,
        type: "password",
      },
    })
  }
  return formFields
}

export type userFormField = Partial<CognitoUserInterface>
export const convertCognitoUserToFormFields = (cognitoUser?: CognitoUserInterface): userFormField => {
  const userToReturn: userFormField = {}
  cognitoUser?.UserAttributes.map((attribute: CognitoUserInterface["attributes"]) => {
    userToReturn[attribute.Name] = attribute.Value
  })
  return userToReturn
}

export const convertUserFormFieldsToCognito = (
  userFormField: userFormField,
  createMode?: boolean,
): Partial<CognitoUserInterface> => {
  let userCognitoToReturn: Partial<CognitoUserInterface> = {
    UserAttributes: [],
  }
  if (createMode) {
    const { temporaryPassword, ...rest } = userFormField
    userCognitoToReturn = {
      ...userCognitoToReturn,
      TemporaryPassword: temporaryPassword,
      Username: userFormField.email,
    }
    Object.keys(rest).map((key) => userCognitoToReturn.UserAttributes.push({ Name: key, Value: userFormField[key] }))
  } else
    Object.keys(userFormField).map((key) =>
      userCognitoToReturn.UserAttributes.push({ Name: key, Value: userFormField[key] }),
    )
  return userCognitoToReturn
}

export const getAllUserGroups = (): {
  GroupName: string
  Precedence: number
}[] => {
  return _.sortBy(configs.authConfig.userGroups, (group) => group.Precedence)
}

export const isSignupDisabled = (): boolean => {
  return (
    (configs.authConfig.userPoolProperties as CognitoUserPoolProperties).AdminCreateUserConfig
      ?.AllowAdminCreateUserOnly || false
  )
}
