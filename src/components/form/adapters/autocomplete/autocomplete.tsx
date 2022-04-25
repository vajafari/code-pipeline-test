import * as React from "react"
import { FieldConfig, FormikContextType, useField, useFormikContext } from "formik"
import { Autocomplete } from "acp/src/components/form/inputs/autocomplete/autocomplete"

export interface AutocompleteAdapter extends FieldConfig {
  label?: string
  optionValueName: string
  className?: string
  componentProps?: Omit<Autocomplete, "value" | "freeSolo" | "onBlur" | "onChange" | "className" | "TextFieldProps"> & {
    TextFieldProps?: Omit<Autocomplete["TextFieldProps"], "onChange"> & {
      onChange?: (newValue: string, formikContext: FormikContextType<any>) => void
    }
    onChange?: (newValue: any, formikContext: FormikContextType<any>) => void
  }
}
export const AutocompleteAdapter = ({
  name,
  label,
  optionValueName,
  className,
  componentProps,
}: AutocompleteAdapter): any => {
  const { onChange, TextFieldProps, multiple, ...componentPropsFiltered } = componentProps || {}
  const formikContext = useFormikContext()
  const [field, meta, helpers] = useField(name)
  const [autocompleteValue, setAutocompleteValue] = React.useState()

  const handleInitialValueSet = (swrDataItem: any[] | undefined) => {
    if (swrDataItem) setAutocompleteValue(multiple ? swrDataItem : swrDataItem[0])
  }

  const onChangeField: Autocomplete["onChange"] = (event, newValue) => {
    setAutocompleteValue(newValue)
    helpers.setValue(
      multiple
        ? (newValue.length ? (newValue as Array<any>) : []).map((eachValue) => eachValue[optionValueName])
        : newValue
        ? newValue[optionValueName]
        : undefined,
    )
    if (onChange)
      onChange(
        multiple ? (newValue as Array<any>).map((eachValue) => eachValue[optionValueName]) : newValue[optionValueName],
        formikContext,
      )
  }
  const onChangeTextField: Autocomplete["TextFieldProps"]["onChange"] = (event: any) => {
    if (TextFieldProps && TextFieldProps.onChange) TextFieldProps.onChange(event.target.value, formikContext)
  }

  const required = (() => {
    return TextFieldProps?.required
  })()

  return (
    <Autocomplete
      {...componentPropsFiltered}
      multiple={multiple}
      label={label}
      className={className}
      value={autocompleteValue}
      onBlur={field.onBlur}
      onChange={onChangeField}
      TextFieldProps={{
        ...TextFieldProps,
        onChange: Boolean(TextFieldProps?.onChange) ? onChangeTextField : undefined,
        helperText: meta.error,
        required,
      }}
      optionValueName={optionValueName}
      initialKeysToRead={field?.value}
      onInitialValueSet={handleInitialValueSet}
    />
  )
}
