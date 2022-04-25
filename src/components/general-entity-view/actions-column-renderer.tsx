import * as React from "react"
import { VirtualizerTable } from "acp/src/components/virtualizer/table"
import { IconButton } from "@material-ui/core"
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons"
import { ColumnType } from "acp/src/components/general-entity-view"

export interface ActionsRenderer {
  isEditable?: boolean
  isDeletable?: boolean
  onEditRequested?: (row: any) => void
  onDeleteRequested?: (row: any) => void
}

export const ActionsColumnRenderer = (props: ActionsRenderer): ColumnType => {
  const { onEditRequested, onDeleteRequested, isEditable, isDeletable } = props
  const tableColumnsActionsRender: VirtualizerTable<any>["columns"][0]["render"] | any = (row: any) => (
    <>
      {isEditable && onEditRequested && (
        <IconButton onClick={() => onEditRequested(row)}>
          <EditIcon />
        </IconButton>
      )}
      {isDeletable && onDeleteRequested && (
        <IconButton onClick={() => onDeleteRequested(row)}>
          <DeleteIcon />
        </IconButton>
      )}
    </>
  )
  return {
    label: `Actions`,
    accessor: `actions`,
    render: tableColumnsActionsRender,
  }
}
