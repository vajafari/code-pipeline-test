import * as React from "react"
import { FieldConfig } from "formik"
import { TextFieldAdapter } from "acp/src/components/form/adapters/text-field"
import { CheckboxAdapter } from "acp/src/components/form/adapters/check-box"
import { CustomizedFieldAdapter } from "acp/src/components/form/adapters/customized-field"
import { AutocompleteAdapter } from "acp/src/components/form/adapters/autocomplete"
import { DatePickerAdapter, TimePickerAdapter, DatetimePickerAdapter } from "acp/src/components/form/adapters/pickers"
import { SelectAdapter } from "acp/src/components/form/adapters/select"
import { MultipleChipSelectAdapter } from "acp/src/components/form/adapters/multiple-chip-select"
import { RadioGroupAdapter } from "acp/src/components/form/adapters/radio-group"
import { FieldCommonProps } from "acp/src/components/form"

export enum fieldType {
  Autocomplete = `Autocomplete`,
  TextField = `TextField`,
  TimePicker = `TimePicker`,
  DatePicker = `DatePicker`,
  DatetimePicker = `DatetimePicker`,
  Checkbox = `Checkbox`,
  Custom = `Custom`,
  Select = `Select`,
  MultipleChipSelect = `MultipleChipSelect`,
  RadioGroup = `RadioGroup`,
}

const setComponent = (component: Field["component"]) => {
  switch (component) {
    case fieldType.TextField:
      return TextFieldAdapter
    case fieldType.Checkbox:
      return CheckboxAdapter
    case fieldType.Select:
      return SelectAdapter
    case fieldType.Autocomplete:
      return AutocompleteAdapter
    case fieldType.TimePicker:
      return TimePickerAdapter
    case fieldType.DatePicker:
      return DatePickerAdapter
    case fieldType.DatetimePicker:
      return DatetimePickerAdapter
    case fieldType.Custom:
      return CustomizedFieldAdapter
    case fieldType.MultipleChipSelect:
      return MultipleChipSelectAdapter
    case fieldType.RadioGroup:
      return RadioGroupAdapter
  }
}

export interface Field extends Omit<FieldConfig, "component" | "name" | "render">, FieldCommonProps {
  component: fieldType
  name?: string
  label?: string
  componentProps?: any // @todo improve typings
  fieldArray?: false
  render?: CustomizedFieldAdapter["render"]
}
// eslint-disable-next-line react/display-name
export const Field = React.memo(({ component, ...props }: Field) => {
  const Component = setComponent(component)

  return <Component {...(props as any)} />
})
