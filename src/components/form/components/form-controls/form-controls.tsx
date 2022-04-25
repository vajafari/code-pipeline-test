import * as React from "react"
import { Button, ButtonProps, CircularProgress } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import { useFormikContext } from "formik"

export interface FormControls {
  form: ButtonProps["form"]
  disabled: boolean
  className?: string
  submitButtonProps?: Omit<ButtonProps, "form" | "type">
  title?: string
  children?: React.ReactNode
  loading?: boolean
}
// eslint-disable-next-line react/display-name
export const FormControls = React.memo(
  ({ className, submitButtonProps, children, title, disabled, loading, ...props }: FormControls): any => {
    const formikContext = useFormikContext()
    const disabledOverride = disabled || formikContext.isSubmitting
    const Wrapper = loading ? Skeleton : React.Fragment

    const commonRender = (
      <Wrapper>
        <Button
          variant="contained"
          type="submit"
          disabled={disabledOverride}
          {...props}
          {...submitButtonProps}
          {...(formikContext.isSubmitting && {
            startIcon: null,
            endIcon: null,
            children: <CircularProgress size={24} />,
          })}
        >
          {title || "Submit"}
        </Button>
        {children}
      </Wrapper>
    )

    return <div className={className}>{commonRender}</div>
  },
)
