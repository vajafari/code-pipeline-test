import * as React from "react"
import { ConfirmDialogBox } from "./confirm-dialog-box"

interface Props {
  onCancel: (e: any) => any
  onConfirm: (e: any) => any
  entityName?: string
  confirmingEntityKeys?: any
  multiple?: boolean
  content?: string
  hideTitle?: boolean
}
const DeleteConfirmDialogBox = (props: Props) => {
  const { confirmingEntityKeys, onCancel, onConfirm, entityName = ``, multiple, content, hideTitle } = props

  return (
    <ConfirmDialogBox
      title={!hideTitle ? `Confirm ${entityName} deletion` : undefined}
      contentText={content || `Are you sure you want to delete ${multiple ? `` : `this `}${entityName}?`}
      confirmText="Delete"
      cancelText="Cancel"
      open={typeof confirmingEntityKeys !== "undefined"}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}

export default DeleteConfirmDialogBox
