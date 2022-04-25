import * as React from "react"
import { VirtualizerTable } from "acp/src/components/virtualizer/table"
import { Edit, Delete, Restore, LockOpen, Lock, GroupAdd } from "@material-ui/icons"
import { DisableableIconButton } from "acp/src/components/users/users-view/actions-column-renderer/disableable-icon-button"
import { ColumnType } from "acp/src/components/general-entity-view"

export interface ActionsRenderer {
  isEditable?: boolean
  isDeletable?: boolean
  isPasswordRenewable?: boolean
  isDisableable?: boolean
  isEnableable?: boolean
  isGroupsViewable?: boolean
  isGroupsChangeable?: boolean
  onEditRequested?: (row: any) => void
  onDeleteRequested?: (row: any) => void
  onPasswordRenewRequested?: (row: any) => void
  onToggleEnabledRequested?: (row: any) => void
  onGroupsChangeRequested?: (row: any) => void
  currentUserSub?: string
}

export const ActionsColumnRenderer = (props: ActionsRenderer): ColumnType => {
  const {
    onEditRequested,
    onDeleteRequested,
    onPasswordRenewRequested,
    onToggleEnabledRequested,
    onGroupsChangeRequested,
    isEditable,
    isDeletable,
    isPasswordRenewable,
    isDisableable,
    isEnableable,
    isGroupsChangeable,
    isGroupsViewable,
    currentUserSub,
  } = props

  const currentUserRow = (row: any): boolean =>
    currentUserSub === row.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "sub")?.Value

  const renewPasswordEnabled = (row: any) => !currentUserRow(row) && row?.UserStatus === "FORCE_CHANGE_PASSWORD"

  const tableColumnsActionsRender: VirtualizerTable<any>["columns"][0]["render"] | any = (row: any) => (
    <>
      {isEditable &&
        onEditRequested &&
        DisableableIconButton({
          row,
          disabled: false,
          onActionRequested: onEditRequested,
          tooltip: "Edit",
          icon: <Edit />,
        })}

      {isDeletable &&
        onDeleteRequested &&
        DisableableIconButton({
          row,
          disabled: currentUserRow(row),
          onActionRequested: onDeleteRequested,
          tooltip: "Delete",
          icon: <Delete />,
        })}
      {isPasswordRenewable &&
        onPasswordRenewRequested &&
        DisableableIconButton({
          row,
          disabled: !renewPasswordEnabled(row),
          onActionRequested: onPasswordRenewRequested,
          tooltip: "Reset temporary Password",
          icon: <Restore />,
        })}
      {(isDisableable || isEnableable) &&
        onToggleEnabledRequested &&
        DisableableIconButton({
          row,
          disabled: currentUserRow(row),
          onActionRequested: onToggleEnabledRequested,
          tooltip: row.Enabled ? "disable" : "enable",
          icon: row.Enabled ? isEnableable ? <Lock /> : undefined : isDisableable ? <LockOpen /> : undefined,
        })}

      {isGroupsViewable &&
        isGroupsChangeable &&
        onGroupsChangeRequested &&
        DisableableIconButton({
          row,
          disabled: currentUserRow(row),
          onActionRequested: onGroupsChangeRequested,
          tooltip: "Groups",
          icon: <GroupAdd />,
        })}
    </>
  )
  return {
    label: `Actions`,
    accessor: `actions`,
    render: tableColumnsActionsRender,
  }
}
