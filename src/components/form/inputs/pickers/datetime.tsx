import { KeyboardDateTimePicker, KeyboardDateTimePickerProps } from "@material-ui/pickers"
import moment, { Moment } from "moment"
import * as React from "react"
import * as Styled from "./styles"
import { PickersProvider } from "./provider"

export interface DatetimePickerValue {
  seconds: number
  ms: number
  date: Moment
}

export interface DatetimePicker extends Omit<KeyboardDateTimePickerProps, "onChange"> {
  onChange: (value: DatetimePickerValue) => void
}
// eslint-disable-next-line react/display-name
export const DatetimePicker = React.memo(
  ({ value, onChange, InputLabelProps, InputProps, ...props }: DatetimePicker) => {
    const onChangeModified = (date: any) => {
      const dateModified = moment(date).utc()
      const valueInSeconds = Number(dateModified.format(`X`))
      const valueInMs = Number(dateModified.format(`x`))
      onChange({ seconds: valueInSeconds, ms: valueInMs, date })
    }
    const classes = Styled.useStyles()

    return (
      <PickersProvider>
        <KeyboardDateTimePicker
          margin="normal"
          format="DD/MM/yyyy HH:mm"
          inputVariant="outlined"
          variant="inline"
          autoOk={true}
          KeyboardButtonProps={{
            "aria-label": `change date`,
            classes: {
              root: classes.KeyboardButtonRoot,
            },
          }}
          value={value || null} // only "null" removes initial value, making the field empty until user takes action
          onChange={onChangeModified}
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
  },
)
