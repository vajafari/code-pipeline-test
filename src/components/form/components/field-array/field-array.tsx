import * as React from "react"
import clsx from "clsx"
import { get } from "lodash"
import { FieldArray as FormikFieldArray, FieldArrayConfig, FieldArrayRenderProps, useFormikContext } from "formik"
import { Box, IconButtonProps, SvgIcon, IconButton, Typography } from "@material-ui/core"
import { AddCircle, DeleteOutline } from "@material-ui/icons"

import { validate } from "../../helpers/validate"
import { FieldCommonProps } from "../../index"
import { Field } from "../field"
import * as Styled from "./styles"

interface handlerIconProps {
  arrayHelpers: FieldArrayRenderProps
  index: number
  fields?: Field[]
}
type handlerIcon = (props: handlerIconProps) => IconButtonProps["onClick"]
const onClickDelete: handlerIcon = (props) => () => {
  props.arrayHelpers.remove(props.index)
}
const onClickAdd = (arrayHelpers: FieldArrayRenderProps) => {
  arrayHelpers.push(undefined)
}

export interface FieldArray extends Omit<FieldArrayConfig, "component">, FieldCommonProps {
  fields: (Field | FieldArray)[]
  fieldArray: true
  disableFirstAdd?: true
  label?: string
  notObject?: true
  disabled?: boolean
}
export const FieldArray = React.memo((props: FieldArray) => {
  const { values, setFieldValue } = useFormikContext()
  const value = React.useMemo(() => get(values, props.name), [props.name, values])
  const classes = Styled.useStyles()

  return (
    <FormikFieldArray name={props.name}>
      {(arrayHelpers) => {
        const arrayLength = value?.length || 0
        if (!arrayLength && !props.disableFirstAdd) {
          onClickAdd(arrayHelpers)
          return null
        }
        const onClickAddHandler = () => {
          onClickAdd(arrayHelpers)
        }

        return (
          <div className={classes.wrapper}>
            {arrayLength > 0 &&
              value.map((i: any, index: number) => (
                <div className={clsx(classes.row, props.className)} key={index}>
                  {props.fields.map(({ name, className, ...field }) => {
                    const key = `${props.name}.${index}${!props.notObject ? `.${name}` : ``}`
                    if (field.validation) {
                      const result = validate(values, { ...field, name: key }, setFieldValue)
                      if (result === null) return result
                    }

                    const commonProps = {
                      key,
                      name: key,
                      ...(field as any),
                    }

                    if (!field.fieldArray) {
                      return <Field className={clsx(classes.field, className)} {...commonProps} />
                    }

                    return <FieldArray {...commonProps} key={key} />
                  })}
                  {!props.disabled && (
                    <IconButton className={classes.buttonIcon} onClick={onClickDelete({ arrayHelpers, index })}>
                      <DeleteOutline />
                    </IconButton>
                  )}
                </div>
              ))}
            {!props.disabled && (
              <Box onClick={onClickAddHandler} className={classes.textBtnWrapper}>
                <SvgIcon viewBox="0 0 16 16" color="primary" component={AddCircle} className={classes.addIcon} />
                <Typography variant="caption" color="primary">
                  Add {props.label || `another`}
                </Typography>
              </Box>
            )}
          </div>
        )
      }}
    </FormikFieldArray>
  )
})
