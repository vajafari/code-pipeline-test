import * as React from "react"
import { useSwrInfinite } from "acp/src/plugins"
import { getEntityApiConfig } from "acp/src/helpers/general-entity-helper"
import { getCognitoAdminAuthorized, getTableColumns } from "acp/src/helpers/user-entity-helper"
import { useCurrentUserInfo } from "acp/src/helpers/hooks/use-current-user-info"
import { EntitiesTable } from "acp/src/components/general-entity-view"
import { useLocation } from "wouter"
import {
  UserDelete,
  UserRenewTemporaryPassword,
  UserToggleEnabled,
  UserChangeGroup,
} from "acp/src/services/user-service"
import { Routes } from "acp/src/constants/routes"
import { encode } from "acp/src/helpers/backend/encoder"
import { ActionsColumnRenderer } from "./actions-column-renderer"
import { RenewPasswordConfirmDialogBox } from "./renew-password-confirm-dialog-box"
import { ToggleEnabledConfirmDialogBox } from "./toggle-enabled-confirm-dialog-box"
import { ChangeUserGroupsDialogBox } from "./change-user-groups-dialog-box"

export const UsersView: React.FC<any> = (props: any) => {
  const entityName = "user"

  const apiGetConfig = getEntityApiConfig({ entityName, httpMethod: "GET" })
  const pages = useSwrInfinite<any>(apiGetConfig)
  const user = useCurrentUserInfo()
  const [, setLocation] = useLocation()

  const [isUserListViewableByUser, setIsUserListViewableByUser] = React.useState<boolean>(false)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (user && !isLoaded) {
      setIsUserListViewableByUser(getCognitoAdminAuthorized("listUsers", user))
      setIsLoaded(true)
    }
  }, [user, isLoaded])

  const isDeletableByUser = getCognitoAdminAuthorized("adminDeleteUser", user)
  const isCreatableByUser = getCognitoAdminAuthorized("adminCreateUser", user)
  const isUpdatableByUser = getCognitoAdminAuthorized("adminUpdateUserAttributes", user)
  const isPasswordRenewableByUser = getCognitoAdminAuthorized("adminSetUserPassword", user)
  const isDisableableByUser = getCognitoAdminAuthorized("adminDisableUser", user)
  const isEnableableByUser = getCognitoAdminAuthorized("adminEnableUser", user)
  const isGroupsViewableByUser = getCognitoAdminAuthorized("adminListGroupsForUser", user)
  const isGroupsChangeableByUser =
    getCognitoAdminAuthorized("adminAddUserToGroup", user) &&
    getCognitoAdminAuthorized("adminRemoveUserFromGroup", user)

  const [confirmingDialogKey, setConfirmingDialogKey] = React.useState<{ [name: string]: string }>()
  const [confirmingRenewPasswordDialogFields, setConfirmingRenewPasswordDialogFields] = React.useState<{
    [name: string]: string
  }>()
  const [confirmingToggleEnabledDialogFields, setConfirmingToggleEnabledDialogFields] = React.useState<{
    [name: string]: any
  }>()
  const [confirmingGroupsChangeDialogFields, setConfirmingGroupsChangeDialogFields] = React.useState<{
    [name: string]: any
  }>()

  const handleDeleteRequested = (row: any) => {
    setConfirmingDialogKey({
      sub: row.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "sub")?.Value,
    })
  }
  const handleDeleteDialogConfirm = async () => {
    setConfirmingDialogKey(undefined)
    if (confirmingDialogKey?.sub)
      await UserDelete({
        sub: confirmingDialogKey?.sub,
        mutate: pages.mutate,
        data: pages.data,
      })
  }
  const handleDeleteDialogCancel = () => {
    setConfirmingDialogKey(undefined)
  }

  const handleRenewPasswordRequested = (row: any) => {
    setConfirmingRenewPasswordDialogFields({
      sub: row.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "sub")?.Value,
      email: row.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "email")?.Value,
    })
  }
  const handleRenewPasswordDialogConfirm = async (temporrayPassword: string) => {
    setConfirmingRenewPasswordDialogFields(undefined)
    if (confirmingRenewPasswordDialogFields?.sub)
      await UserRenewTemporaryPassword(confirmingRenewPasswordDialogFields?.sub, temporrayPassword)
  }
  const handleRenewPasswordDialogCancel = () => {
    setConfirmingRenewPasswordDialogFields(undefined)
  }

  const handleToggleEnabledRequested = (row: any) => {
    setConfirmingToggleEnabledDialogFields({
      sub: row.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "sub")?.Value,
      email: row.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "email")?.Value,
      enabled: row.Enabled,
    })
  }
  const handleToggleEnabledDialogConfirm = async () => {
    setConfirmingToggleEnabledDialogFields(undefined)
    if (confirmingToggleEnabledDialogFields?.sub)
      await UserToggleEnabled({
        sub: confirmingToggleEnabledDialogFields?.sub,
        enabled: confirmingToggleEnabledDialogFields?.enabled,
        mutate: pages.mutate,
        data: pages.data,
      })
  }
  const handleToggleEnabledDialogCancel = () => {
    setConfirmingToggleEnabledDialogFields(undefined)
  }

  const handleEditRequested = (row: any) => {
    setLocation(
      Routes.UserEdit(
        encode({
          sub: row.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "sub")?.Value,
        }),
      ),
    )
  }

  const handleGroupsChangeRequested = (row: any) => {
    setConfirmingGroupsChangeDialogFields({
      sub: row.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "sub")?.Value,
      email: row.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "email")?.Value,
    })
  }
  const handleGroupsChangeDialogConfirm = async (currentUserGroup?: string, newUserGroup?: string) => {
    setConfirmingGroupsChangeDialogFields(undefined)
    if (confirmingGroupsChangeDialogFields?.sub)
      UserChangeGroup({ sub: confirmingGroupsChangeDialogFields?.sub, currentUserGroup, newUserGroup })
  }
  const handleGroupsChangeDialogCancel = () => {
    setConfirmingGroupsChangeDialogFields(undefined)
  }

  const columns = [
    ...getTableColumns(),
    ActionsColumnRenderer({
      isDeletable: isDeletableByUser,
      onDeleteRequested: handleDeleteRequested,
      isEditable: isUpdatableByUser,
      onEditRequested: handleEditRequested,
      isPasswordRenewable: isPasswordRenewableByUser,
      onPasswordRenewRequested: handleRenewPasswordRequested,
      isDisableable: isDisableableByUser,
      isEnableable: isEnableableByUser,
      onToggleEnabledRequested: handleToggleEnabledRequested,
      isGroupsViewable: isGroupsViewableByUser,
      isGroupsChangeable: isGroupsChangeableByUser,
      onGroupsChangeRequested: handleGroupsChangeRequested,
      currentUserSub: user?.attributes.sub,
    }),
  ]

  return isLoaded ? (
    <>
      <RenewPasswordConfirmDialogBox
        onCancel={handleRenewPasswordDialogCancel}
        onConfirm={handleRenewPasswordDialogConfirm}
        userInfo={confirmingRenewPasswordDialogFields}
      />
      <ToggleEnabledConfirmDialogBox
        onCancel={handleToggleEnabledDialogCancel}
        onConfirm={handleToggleEnabledDialogConfirm}
        userInfo={confirmingToggleEnabledDialogFields}
      />
      <ChangeUserGroupsDialogBox
        onCancel={handleGroupsChangeDialogCancel}
        onConfirm={handleGroupsChangeDialogConfirm}
        userInfo={confirmingGroupsChangeDialogFields}
        isGroupsChangeable={isGroupsChangeableByUser}
      />
      <EntitiesTable
        entityName={entityName}
        displayName={"User"}
        confirmingDialogEntityKeys={confirmingDialogKey}
        onDialogConfirm={handleDeleteDialogConfirm}
        onDialogCancel={handleDeleteDialogCancel}
        isCreatableByUser={isCreatableByUser}
        isViewableByUser={isUserListViewableByUser}
        columns={columns}
        pages={pages}
      />
    </>
  ) : null
}
