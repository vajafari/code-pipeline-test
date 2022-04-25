import { Checkbox, CheckboxProps, FormControlLabel } from "@material-ui/core"
import { FieldConfig, useField } from "formik"
import * as React from "react"

export interface CheckboxAdapter extends FieldConfig {
  label?: React.ReactElement | string
  componentProps?: Omit<
    CheckboxProps,
    "onChange" | "helperText" | "disabled" | "label" | "value" | "onBlur" | "margin" | "variant" | "checked"
  >
  className?: string
}
export const CheckboxAdapter: React.FC<CheckboxAdapter> = ({
  label,
  componentProps,
  className,
  ...props
}: CheckboxAdapter) => {
  const field = useField(props)
  const fieldInput = field[0]
  const fieldHelpers = field[2]
  const onChange: CheckboxProps["onChange"] = (_, checked) => {
    fieldHelpers.setValue(checked)
  }
  const { inputProps, ...componentPropsFiltered } = componentProps || {}

  return (
    <FormControlLabel
      label={label}
      className={className}
      control={
        <Checkbox
          checked={Boolean(fieldInput.value)}
          onChange={onChange}
          inputProps={inputProps}
          {...componentPropsFiltered}
        />
      }
    />
  )
}
