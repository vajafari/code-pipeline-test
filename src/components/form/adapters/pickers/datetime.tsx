import { FieldConfig, useField } from "formik"
import * as React from "react"
import { DatetimePicker, DatetimePickerValue } from "acp/src/components/form/inputs/pickers"
import moment from "moment"

export interface DatetimePickerAdapter extends Pick<FieldConfig, "name"> {
  label?: string
  componentProps?: Omit<DatetimePicker, "label" | "value" | "onChange" | "onBlur">
}
// eslint-disable-next-line react/display-name
export const DatetimePickerAdapter = React.memo((props: DatetimePickerAdapter) => {
  const [{ value }, meta, helpers] = useField<number>(props.name)
  const [dateValue, setDateValue] = React.useState<DatetimePickerValue>()

  const handleOnChange: DatetimePicker["onChange"] = (value) => {
    setDateValue(value)
    helpers.setValue(value?.seconds)
  }

  React.useEffect(() => {
    if (value && !dateValue) {
      setDateValue({ seconds: value, ms: Number(moment.unix(value).format(`x`)), date: moment.unix(value) })
    }
  }, [])

  return (
    <DatetimePicker
      label={props.label}
      value={dateValue?.date}
      onChange={handleOnChange}
      error={Boolean(meta.error)}
      helperText={meta.error}
      {...props.componentProps}
    />
  )
})
