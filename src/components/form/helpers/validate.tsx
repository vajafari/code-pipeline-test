import { get, initial } from "lodash"
import { Section } from "acp/src/components/form/components/section"
import { Field } from "acp/src/components/form/components/field"
import { FieldArray } from "acp/src/components/form/components/field-array"
import { Tab } from "acp/src/components/form/components/section"
import { isNotTab } from "acp/src/components/form/helpers/fields-helper"

export const validate = (values: any, item: Field | FieldArray | Section, setFieldValue: any): any => {
  if (Array.isArray(item)) {
    const [sectionConfig, sectionFields] = item

    if (sectionConfig && sectionConfig.validation) {
      const value = (() => {
        return get(values, sectionConfig.validation.field)
      })()

      const shouldRender = Array.isArray(value) ? value?.length > 0 : value === sectionConfig.validation.value
      if (!shouldRender) {
        if (isNotTab(sectionFields)) {
          sectionFields.forEach((sectionField: Field | FieldArray) => {
            if (sectionField && sectionField.name && values[sectionField.name] !== undefined) {
              setFieldValue(sectionField.name, undefined)
            }
          })
        } else {
          //for tabs
          sectionFields.forEach((sectionField: Tab) => {
            const [sectionTabConfig, sectionTabFields] = sectionField

            if (sectionTabConfig.validation) {
              const value = (() => {
                return get(values, sectionTabConfig.validation.field)
              })()
              const shouldRender = Array.isArray(value)
                ? value?.length > 0
                : value === sectionTabConfig.validation.value
              if (!shouldRender) {
                sectionTabFields.forEach((field: Field | FieldArray) => {
                  if (field && field.name && values[field.name] !== undefined) {
                    setFieldValue(field.name, undefined)
                  }
                })
              }
            }
          })
        }

        return null
      }
    }
  } else {
    const value = (() => {
      if (item.validation && !item.validation?.fieldArray) {
        return get(values, item.validation?.field)
      }

      const path = item?.name?.split(`.`)
      const name = `${initial(path).join(`.`)}.${item?.validation?.field}`
      return get(values, name)
    })()

    const shouldRender = Array.isArray(value) ? value?.length > 0 : value === item?.validation?.value
    if (!shouldRender) {
      if (item && item.name && values[item.name] !== undefined) {
        setFieldValue(item.name, undefined)
      }

      return null
    }
  }
}
