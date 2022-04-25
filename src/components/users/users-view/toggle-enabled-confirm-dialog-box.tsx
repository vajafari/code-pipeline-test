import * as React from "react"
import { ConfirmDialogBox } from "acp/src/components/confirm-dialog-box/confirm-dialog-box"

interface Props {
  onCancel: (e: any) => any
  onConfirm: (e: any) => any
  userInfo: any
}
export const ToggleEnabledConfirmDialogBox = (props: Props) => {
  const { userInfo, onCancel, onConfirm } = props
  const { enabled, email } = userInfo || {}

  return (
    <ConfirmDialogBox
      title={enabled ? "Disable user" : "Enable user"}
      contentText={`Are you sure you want to ${enabled ? "disable user" : "enable user"} "${email}"?`}
      confirmText={enabled ? "Disable user" : "Enable user"}
      cancelText="Cancel"
      open={Boolean(userInfo)}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
