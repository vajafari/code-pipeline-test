import { Field } from "acp/src/components/form/components/field"
import { FieldArray } from "acp/src/components/form/components/field-array"
import { Tab } from "acp/src/components/form/components/section"

export const isNotTab = (items: Tab[] | (Field | FieldArray)[]): items is (Field | FieldArray)[] => {
  return (
    (items as Field[]).every((item) => item.component !== undefined) ||
    (items as FieldArray[]).every((item) => item.fieldArray)
  )
}
