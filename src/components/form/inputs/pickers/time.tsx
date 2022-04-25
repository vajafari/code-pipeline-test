import { KeyboardTimePicker, KeyboardTimePickerProps } from "@material-ui/pickers"
import * as React from "react"
import * as Styled from "./styles"
import { PickersProvider } from "./provider"

export interface Time {
  hour: number
  minute: number
  timezone: "America/Danmarkshavn" //UTC
}

export type TimePicker = KeyboardTimePickerProps
// eslint-disable-next-line react/display-name
export const TimePicker = React.memo(({ InputLabelProps, InputProps, ...props }: TimePicker) => {
  const classes = Styled.useStyles()

  return (
    <PickersProvider>
      <KeyboardTimePicker
        margin="normal"
        format="HH:mm"
        inputVariant="outlined"
        variant="inline"
        autoOk={true}
        KeyboardButtonProps={{
          "aria-label": `change time`,
          classes: {
            root: classes.KeyboardButtonRoot,
          },
        }}
        className={classes.root}
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
            marginDense: classes.InputMarginDense,
            inputMarginDense: classes.InputInputMarginDense,
          },
          ...InputProps,
        }}
        FormHelperTextProps={{
          classes: { root: classes.FormHelperTextRoot },
        }}
        {...props}
      />
    </PickersProvider>
  )
})
