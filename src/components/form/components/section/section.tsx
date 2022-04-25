import { Field } from "acp/src/components/form/components/field"
import { FieldArray } from "acp/src/components/form/components/field-array"
import { AccordionDetailsProps } from "@material-ui/core"

export type Tab = [
  {
    label: string
    className?: string
    validation?: {
      field: string
      value: any
    }
  },
  (Field | FieldArray)[],
]

export type Section = [
  {
    label: string
    className?: string
    validation?: {
      field: string
      value: any
    }
    classesAccordionDetails?: AccordionDetailsProps["classes"]
    defaultExpanded?: boolean
  },
  (Field | FieldArray)[] | Tab[],
]
