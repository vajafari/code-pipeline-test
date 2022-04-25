import * as React from "react"
import { Field } from "../components/field"
import { FieldArray } from "../components/field-array"
import { validate } from "./validate"

export const renderItem = (values: any, item: Field | FieldArray, setFieldValue: any, idx: number): any => {
  if (item.validation) {
    const result = validate(values, item, setFieldValue)
    if (result === null) return result
  }

  const key = `${idx}${item.name}`
  const Item = !item.fieldArray ? Field : FieldArray

  return <Item key={key} {...(item as any)} />
}
