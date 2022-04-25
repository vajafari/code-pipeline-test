import { KeyboardDatePicker, KeyboardDatePickerProps } from "@material-ui/pickers"
import moment, { Moment } from "moment"
import * as React from "react"
import * as Styled from "./styles"
import { PickersProvider } from "./provider"

export interface DatePickerValue {
  seconds: number
  ms: number
  date: Moment
}

export interface DatePicker extends Omit<KeyboardDatePickerProps, "onChange"> {
  onChange: (value: DatePickerValue) => void
  endOfDay?: boolean
}
// eslint-disable-next-line react/display-name
export const DatePicker = React.memo(
  ({ value, endOfDay, onChange, InputLabelProps, InputProps, ...props }: DatePicker) => {
    const onChangeModified = (date: any) => {
      const dateModified = moment(date).utc()[endOfDay ? `endOf` : `startOf`](`day`)
      const valueInSeconds = Number(dateModified.format(`X`))
      const valueInMs = Number(dateModified.format(`x`))
      onChange({ seconds: valueInSeconds, ms: valueInMs, date })
    }
    const classes = Styled.useStyles()

    return (
      <PickersProvider>
        <KeyboardDatePicker
          margin="normal"
          format="DD/MM/yyyy"
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
