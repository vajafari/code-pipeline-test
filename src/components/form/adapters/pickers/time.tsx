import { FieldConfig, useField } from "formik"
import { Moment } from "moment"
import * as React from "react"
import { TimePicker } from "acp/src/components/form/inputs/pickers"

export interface TimePickerAdapter extends Pick<FieldConfig, "name"> {
  label?: string
  componentProps?: Omit<TimePicker, "label" | "value" | "onChange" | "onBlur">
}
// eslint-disable-next-line react/display-name
export const TimePickerAdapter = React.memo((props: TimePickerAdapter) => {
  const [{ value, onChange, ...field }, meta] = useField(props)
  const handleOnChange = (value: Moment) => {
    onChange({
      target: {
        ...field,
        value: value
          ? {
              hour: value.hour(),
              minute: value.minute(),
              timezone: `America/Danmarkshavn`,
            }
          : { hour: 0, minute: 0, timezone: `America/Danmarkshavn` },
      },
    })
  }

  return (
    <TimePicker
      {...field}
      label={props.label}
      value={value}
      onChange={(value) => handleOnChange(value as Moment)}
      error={Boolean(meta.error)}
      helperText={meta.error}
      {...props.componentProps}
    />
  )
})
