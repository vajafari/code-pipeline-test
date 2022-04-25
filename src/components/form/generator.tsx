import { makeStyles, Tab, Tabs } from "@material-ui/core"
import { Accordion } from "acp/src/components/expansion-panel"
import { Field } from "acp/src/components/form/components/field"
import { FieldArray } from "acp/src/components/form/components/field-array"
import { Form } from "acp/src/components/form/components/form"
import { FormControls } from "acp/src/components/form/components/form-controls"
import { Section } from "acp/src/components/form/components/section"
import { TabPanel } from "acp/src/components/form/components/section/tab-panel"
import { isNotTab } from "acp/src/components/form/helpers/fields-helper"
import { renderItem } from "acp/src/components/form/helpers/render-item"
import { validate } from "acp/src/components/form/helpers/validate"
import clsx from "clsx"
import { Formik, FormikConfig, FormikProps } from "formik"
import * as React from "react"

const useStyles = makeStyles((theme) => ({
  grid: {
    display: `grid`,
    gridTemplateColumns: `300px 300px`,
    gridTemplateRows: `auto`,
    gridGap: 16,
  },
  root: {
    width: `100%`,
    margin: theme.spacing(0, 0, 2),
  },
  tabContainer: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 170,
  },
  tabButtons: {
    alignItems: "start",
    textAlign: "start",
  },
}))

/**
 * Stop enter submitting the form.
 * @param keyEvent Event triggered when the user presses a key.
 *
 * We free "Enter" key event for Autocomplete
 */
const onKeyDown = (keyEvent: any) => {
  const keyCodeEnter = 13
  if ((keyEvent.charCode || keyEvent.keyCode) === keyCodeEnter) {
    keyEvent.preventDefault()
  }
}

export interface FieldCommonProps {
  className?: string
  validation?: {
    field: string
    value: any
    fieldArray?: boolean
  }
}

/**
 * @todo improve type inference
 */
export interface Generator<Values = any> extends Omit<FormikConfig<Values>, "initialValues" | "innerRef"> {
  fields: (Field | FieldArray | Section)[]
  formId?: string
  initialValues?: any
  disabled?: boolean
  className?: string
  fieldsClassName?: string
  setFieldValueRef?: any
  submitFormRef?: any
  innerRef?: React.MutableRefObject<FormikProps<any>>
  FormControlsProps?: Pick<FormControls, "className" | "children" | "title" | "submitButtonProps" | "loading">
  children?: React.ReactNode
}
// eslint-disable-next-line react/display-name
export const Generator = React.memo(
  ({
    fields,
    initialValues = {},
    formId = `default`,
    disabled,
    className,
    fieldsClassName,
    setFieldValueRef,
    submitFormRef,
    onSubmit,
    FormControlsProps,
    children,
    ...props
  }: Generator) => {
    const classes = useStyles()
    const [tabValue, setTabValue] = React.useState(0)

    const onTabChange = (event: any, newValue: number) => {
      setTabValue(newValue)
    }

    const handleGenerateVisibleTabs = (fields: any, values: any, setFieldValue: any) => {
      return fields.map((field: any) => {
        if (Array.isArray(field)) {
          const [sectionConfig, sectionFields] = field

          const availableFields = sectionFields?.filter((sectionField: Field | Section) => {
            if (Array.isArray(sectionField)) {
              const [sectionTabConfig] = sectionField
              if (sectionTabConfig.validation) {
                return validate(values, sectionField, setFieldValue) !== null
              } else {
                return true
              }
            } else {
              return true
            }
          })
          return [sectionConfig, availableFields]
        } else {
          return field
        }
      })
    }

    return (
      <Formik {...(props as typeof props & { onSubmit: () => void; innerRef: any })} initialValues={initialValues}>
        {({ values, isSubmitting, setFieldValue, submitForm, errors }) => {
          if (setFieldValueRef) setFieldValueRef(setFieldValue)
          if (submitFormRef) submitFormRef(submitForm)
          const hasErrors = Object.keys(errors).length > 0

          return (
            <>
              <Form
                id={formId}
                disabled={disabled}
                className={clsx(className || classes.grid, classes.root)}
                onKeyDown={onKeyDown}
                onSubmit={onSubmit}
              >
                {handleGenerateVisibleTabs(fields, values, setFieldValue).map((item: Field | Section, idx: number) => {
                  if (!item) return null

                  if (Array.isArray(item)) {
                    const [sectionConfig, sectionFields] = item
                    let isValid = true
                    if (sectionConfig.validation) isValid = validate(values, item, setFieldValue) !== null

                    return (
                      isValid && (
                        <Accordion
                          key={`${idx}${sectionConfig.label}`}
                          defaultExpanded={sectionConfig.defaultExpanded}
                          label={sectionConfig.label}
                          className={sectionConfig.className}
                          classesAccordionDetails={sectionConfig.classesAccordionDetails}
                        >
                          {isNotTab(sectionFields) ? (
                            sectionFields.map((sectionField, sectionFieldIdx) => {
                              if (!sectionField) return null

                              return renderItem(
                                values,
                                { className: fieldsClassName, ...sectionField },
                                setFieldValue,
                                sectionFieldIdx,
                              )
                            })
                          ) : (
                            <div className={classes.tabContainer}>
                              <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                textColor="secondary"
                                value={tabValue}
                                onChange={onTabChange}
                                className={classes.tabs}
                              >
                                {sectionFields?.map((sectionField: any, sectionFieldIdx: any) => {
                                  const [sectionTabConfig] = sectionField
                                  return (
                                    <Tab
                                      label={sectionTabConfig.label}
                                      id={`vertical-tab-${sectionFieldIdx}`}
                                      aria-controls={`vertical-tabpanel-${sectionFieldIdx}`}
                                      key={`tab-${sectionFieldIdx}`}
                                      classes={{ wrapper: classes.tabButtons }}
                                    />
                                  )
                                })}
                              </Tabs>
                              {sectionFields?.map((sectionField: any, sectionFieldIdx: any) => {
                                const [sectionTabConfig, sectionTabFields] = sectionField

                                return (
                                  <TabPanel
                                    value={tabValue}
                                    index={sectionFieldIdx}
                                    key={`tabPanel-${sectionFieldIdx}`}
                                    className={sectionTabConfig.className}
                                    tabContainerHeight={650}
                                  >
                                    {sectionTabFields.map((field: any, fieldIdx: number) => {
                                      if (!field) return null

                                      return renderItem(
                                        values,
                                        { className: fieldsClassName, ...field },
                                        setFieldValue,
                                        fieldIdx,
                                      )
                                    })}
                                  </TabPanel>
                                )
                              })}
                            </div>
                          )}
                        </Accordion>
                      )
                    )
                  }
                  return renderItem(values, { className: fieldsClassName, ...item }, setFieldValue, idx)
                })}
              </Form>
              {children}
              <FormControls form={formId} disabled={isSubmitting || disabled || hasErrors} {...FormControlsProps} />
            </>
          )
        }}
      </Formik>
    )
  },
)
