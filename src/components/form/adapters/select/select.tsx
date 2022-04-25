import { FieldConfig, useField } from "formik"
import * as React from "react"
import { Select } from "acp/src/components/form/inputs/select"

export interface SelectAdapter extends FieldConfig {
  label?: string
  className?: string
  componentProps: Omit<Select, "value" | "onChange" | "onBlur" | "error"> & {
    options: {
      label: string
      value?: string
      tooltip?: string
    }[]
  }
}
// eslint-disable-next-line react/display-name
export const SelectAdapter = React.memo(
  ({
    name,
    label,
    className,
    componentProps = {} as SelectAdapter["componentProps"], // eslint-disable-line @typescript-eslint/consistent-type-assertions
  }: SelectAdapter) => {
    const [{ value = ``, ...field }, meta] = useField(name)
    return (
      <Select
        {...componentProps}
        {...field}
        value={value}
        className={className}
        label={label}
        error={Boolean(meta.error)}
        disabled={componentProps?.disabled}
        helperText={meta.error}
      />
    )
  },
)
