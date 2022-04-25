import * as React from "react"
import { ChipProps } from "@material-ui/core"
import { FieldConfig, useField } from "formik"
import { unionBy } from "lodash"
import { TextField } from "acp/src/components/form/inputs/text-field"
import { MultipleChipSelect, MultipleChipSelectOption } from "acp/src/components/form/inputs/multiple-chip-select"

export interface MultipleChipSelectAdapter extends FieldConfig, Pick<TextField, "className"> {
  label: string
  componentProps?: Omit<TextField, "value" | "onChange" | "disabled" | "onBlur" | "error"> & {
    options: MultipleChipSelectOption[]
  }
}

export const MultipleChipSelectAdapter: React.FC<MultipleChipSelectAdapter> = ({
  name,
  label,
  componentProps,
  className,
}: MultipleChipSelectAdapter) => {
  const [{ value = [] }, meta, helpers] = useField<React.ReactText[]>(name)

  const { options = [] } = componentProps || {}
  const optionsAndDeletedOptions = unionBy(
    options,
    (value || []).map((v) => ({ label: v.toString(), value: v })),
    `value`,
  )
  const handleDeleteChip = (chip: React.ReactText): ChipProps["onDelete"] => () => {
    helpers.setValue(value.filter((chipValue) => chipValue !== chip))
  }
  const onChange: TextField["onChange"] = (event) => {
    helpers.setValue((event.target.value as unknown) as React.ReactText[])
  }

  return (
    <MultipleChipSelect
      {...componentProps}
      className={className}
      onChange={onChange}
      error={Boolean(meta.error)}
      helperText={meta.error}
      value={value}
      label={label}
      onDeleteChip={handleDeleteChip}
      options={optionsAndDeletedOptions}
    />
  )
}
