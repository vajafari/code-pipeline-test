import { useFormikContext } from "formik"
import { isEmpty } from "lodash"
import * as React from "react"
import { useMountedState } from "react-use"
/**
 * Not using https://jaredpalmer.com/formik/docs/api/form
 *   - as we wrap the onSubmit handler with our unified notification management
 */
export interface Form extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit: (values: any, formikProps: any) => void | Promise<void>
  disabled?: boolean
}
export const Form: React.FC<Form> = ({ onSubmit, disabled, ...props }: Form) => {
  const isMounted = useMountedState()
  const formikContext = useFormikContext()
  const onSubmitModified = async (event: any) => {
    event.stopPropagation()
    event.preventDefault()
    const isValid = isEmpty(formikContext.errors)

    if (isValid) {
      formikContext.setSubmitting(true)
      try {
        await onSubmit(formikContext.values, formikContext)
      } catch (error) {
        console.error(`Backend API request failed, please try again...`, error)
      } finally {
        if (isMounted()) {
          formikContext.setSubmitting(false)
        }
      }
    }
  }

  return <form {...(!disabled && { onSubmit: onSubmitModified })} {...(props as any)} />
}
