import { IconButton, MenuItem, styled, Tooltip } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import { TextField } from "acp/src/components/form/inputs/text-field"
import * as React from "react"
import * as Styled from "./styles"

const Overlay = styled(`div`)({
  position: `absolute`,
  height: `100%`,
  width: `100%`,
  top: 0,
  left: 0,
})

export interface Select extends Omit<TextField, "select"> {
  value?: string | number
  options: {
    label: string
    value?: string
    tooltip?: string
    disabled?: boolean
  }[]
  onClearSelection?: any
}
// eslint-disable-next-line react/display-name
export const Select = React.memo(({ options, required, onClearSelection, ...props }: Select) => {
  const classes = Styled.useStyles()

  return (
    <TextField
      {...props}
      select
      value={props.value ?? ""}
      required={required}
      {...(!required && {
        InputProps: {
          ...props.InputProps,
          endAdornment: (
            <>
              {props.InputProps && props.InputProps.endAdornment}
              {!required && onClearSelection && (
                <IconButton size="small" className={classes.InputAdornedEndRequired} onClick={onClearSelection}>
                  <CloseIcon />
                </IconButton>
              )}
            </>
          ),
        },
      })}
    >
      {options?.map((item: Select["options"][0], idx) => (
        <MenuItem
          className={classes.menuItem}
          value={item.value ?? item.label}
          key={`${idx}${item.value}`}
          disabled={item.disabled}
        >
          {item.tooltip && (
            <Tooltip title={item.tooltip}>
              <Overlay />
            </Tooltip>
          )}
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  )
})
