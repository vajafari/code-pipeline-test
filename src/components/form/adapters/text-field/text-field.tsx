import { FieldConfig, useField } from "formik"
import * as React from "react"
import MaskedInput, { MaskedInputProps } from "react-text-mask"
import { TextField } from "acp/src/components/form/inputs/text-field"

/**
 * Fixes issue with `inputRef` warning
 */
const TextMaskCustom: React.FC<any> = ({ inputRef, ...props }: any) => {
  const ref = (ref: any) => {
    inputRef(ref ? ref.inputElement : null)
  }

  return <MaskedInput {...props} guide={false} ref={ref} showMask />
}

interface TextFieldAdapter extends FieldConfig {
  label?: string
  className?: string
  componentProps?: Omit<TextField, "onChange" | "helperText" | "value" | "onBlur" | "margin" | "className"> &
    Pick<MaskedInputProps, "mask">
}
export const TextFieldAdapter: React.FC<TextFieldAdapter> = ({
  name,
  label,
  className,
  componentProps,
}: TextFieldAdapter) => {
  const [{ value = `` }, meta, helpers] = useField(name)
  const { mask, InputProps, inputProps = {}, ...componentPropsFiltered } = componentProps || {}
  const onChange: TextField["onChange"] = (event) => {
    const newValue = componentProps?.type === "number" ? Number(event.target.value) : event.target.value
    helpers.setValue(newValue || undefined)
  }

  return (
    <TextField
      {...componentPropsFiltered}
      onChange={onChange}
      className={className}
      value={value}
      label={label}
      error={Boolean(meta.error)}
      helperText={meta.error}
      disabled={componentProps?.disabled}
      {...(Boolean(mask)
        ? {
            InputProps: { inputComponent: TextMaskCustom, ...InputProps },
            inputProps: { mask, ...inputProps },
          }
        : { InputProps, inputProps })}
    />
  )
}
