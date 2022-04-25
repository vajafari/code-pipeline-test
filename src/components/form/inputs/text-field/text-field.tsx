import { TextField as MUITextField, TextFieldProps } from "@material-ui/core"
import { KeyboardArrowDown } from "@material-ui/icons"
import * as React from "react"

import * as Styled from "./styles"

export type TextField = Omit<TextFieldProps, "variant"> & {
  hideBorder?: boolean
}

// eslint-disable-next-line react/display-name
export const TextField = React.memo(
  React.forwardRef(
    (
      // eslint-disable-next-line react/prop-types
      { InputProps, InputLabelProps, SelectProps, hideBorder = false, ...props }: TextField,
      ref: React.RefObject<HTMLDivElement> | React.ForwardedRef<HTMLDivElement>,
    ) => {
      const classes = Styled.useStyles({ hideBorder })

      return (
        <MUITextField
          ref={ref}
          variant={"outlined"}
          classes={{ root: classes.root }}
          InputLabelProps={{
            ...InputLabelProps,
            shrink: true,
            classes: { root: classes.InputLabelRoot },
          }}
          InputProps={{
            classes: {
              root: classes.InputRoot,
              input: classes.InputInput,
              notchedOutline: classes.InputNotchedOutline,
              focused: classes.focused,
              inputAdornedStart: classes.InputInputAdornedStart,
              adornedStart: classes.InputAdornedStart,
              adornedEnd: classes.InputAdornedEnd,
              marginDense: classes.InputMarginDense,
              inputMarginDense: classes.InputInputMarginDense,
            },
            ...InputProps,
          }}
          FormHelperTextProps={{
            classes: { root: classes.FormHelperTextRoot },
          }}
          SelectProps={{
            classes: { outlined: classes.focused },
            IconComponent: KeyboardArrowDown,
            ...SelectProps,
          }}
          {...props}
        />
      )
    },
  ),
)
