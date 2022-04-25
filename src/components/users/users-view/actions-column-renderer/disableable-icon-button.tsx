import * as React from "react"
import { IconButton, Tooltip } from "@material-ui/core"

export interface DisableableIconButtonProps {
  row: any
  tooltip: string
  disabled: boolean
  icon?: React.ReactElement
  onActionRequested: (row: any) => void
}
export const DisableableIconButton = ({
  row,
  tooltip,
  disabled,
  icon,
  onActionRequested,
}: DisableableIconButtonProps): React.ReactElement => {
  const component = (row: any, disabled: boolean) => (
    <IconButton onClick={() => icon && onActionRequested && onActionRequested(row)} disabled={disabled}>
      {icon}
    </IconButton>
  )

  return disabled ? (
    component(row, true)
  ) : (
    <Tooltip arrow title={tooltip}>
      {component(row, false)}
    </Tooltip>
  )
}
