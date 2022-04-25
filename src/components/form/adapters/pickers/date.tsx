import { FieldConfig, useField } from "formik"
import * as React from "react"
import { DatePicker, DatePickerValue } from "acp/src/components/form/inputs/pickers"
import moment from "moment"

export interface DatePickerAdapter extends Pick<FieldConfig, "name"> {
  label?: string
  componentProps?: Omit<DatePicker, "label" | "value" | "onChange" | "onBlur">
}
// eslint-disable-next-line react/display-name
export const DatePickerAdapter = React.memo((props: DatePickerAdapter) => {
  const [{ value }, meta, helpers] = useField<number>(props.name)
  const [dateValue, setDateValue] = React.useState<DatePickerValue>()

  const handleOnChange: DatePicker["onChange"] = (value) => {
    setDateValue(value)
    helpers.setValue(value?.seconds)
  }

  React.useEffect(() => {
    if (value && !dateValue) {
      setDateValue({ seconds: value, ms: Number(moment.unix(value).format(`x`)), date: moment.unix(value) })
    }
  }, [])

  return (
    <DatePicker
      label={props.label}
      value={dateValue?.date}
      onChange={handleOnChange}
      error={Boolean(meta.error)}
      helperText={meta.error}
      {...props.componentProps}
    />
  )
})
