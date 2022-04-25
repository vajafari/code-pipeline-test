import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
  Typography,
} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { FieldConfig, useField } from "formik"
import * as React from "react"

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    radioGroupContainer: {
      alignItems: "flex-start",
    },
    radioGroupContainerWithCaption: {
      alignItems: "center",
    },
    radio: {
      paddingTop: 0,
      marginBottom: theme.spacing(1),
    },
    title: {
      marginBottom: theme.spacing(2),
    },
    caption: {
      marginBottom: theme.spacing(1),
    },
  }),
)

export interface RadioGroupAdapter extends FieldConfig {
  label?: string
  areaLabel?: string
  componentProps?: Omit<
    RadioGroupProps,
    "onChange" | "helperText" | "disabled" | "label" | "value" | "onBlur" | "variant" | "required"
  > & {
    options: {
      label: string
      value?: any
      caption?: string
      disabled?: boolean
    }[]
    required?: boolean
    className?: string
  }
  className?: string
}
export const RadioGroupAdapter: React.FC<RadioGroupAdapter> = ({
  name,
  label,
  areaLabel,
  className,
  componentProps,
}: RadioGroupAdapter) => {
  const [{ value }, meta, helpers] = useField(name)
  const classes = useStyles()

  const onChange: RadioGroupProps["onChange"] = (event) => {
    helpers.setValue(
      event?.target?.value === "true" || event?.target?.value === "false"
        ? event?.target?.value === "true"
        : event?.target?.value,
    )
  }

  return (
    <FormControl component="fieldset" error={Boolean(meta.error)} className={className}>
      <FormLabel component="legend" className={classes.title}>
        {label}
      </FormLabel>
      <RadioGroup
        aria-label={areaLabel}
        name={name}
        value={value?.toString() || ""}
        onChange={onChange}
        className={componentProps?.className}
      >
        {componentProps?.options?.map((option, index: number) => (
          <FormControlLabel
            key={`${index}-${option.value}`}
            value={option.value?.toString() || ""}
            control={<Radio required={componentProps?.required} className={classes.radio} />}
            className={option.caption ? classes.radioGroupContainerWithCaption : classes.radioGroupContainer}
            label={
              <Box display="flex" flexDirection="column">
                <Typography variant="body2" display="block">
                  {option.label}
                </Typography>
                {option.caption && (
                  <Typography variant="caption" display="block" color="textSecondary" className={classes.caption}>
                    {option.caption}
                  </Typography>
                )}
              </Box>
            }
            disabled={option.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
