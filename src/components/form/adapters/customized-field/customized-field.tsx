import { FieldConfig, FieldProps, FormikContextType, useField, useFormikContext } from "formik"
import * as React from "react"

export interface CustomizedFieldAdapterRenderProps extends FieldProps, Partial<React.ComponentProps<React.FC>> {
  context: FormikContextType<any>
}

export interface CustomizedFieldAdapter {
  name: FieldConfig["name"]
  label?: string
  componentProps?: any
  render: (props: CustomizedFieldAdapterRenderProps) => JSX.Element | any
}

export const CustomizedFieldAdapter = ({ label, componentProps, render, name }: CustomizedFieldAdapter): any => {
  const [field, meta] = useField(name)
  const context = useFormikContext()
  return render({ field, meta, context, label, name, ...componentProps })
}
