import { Chip, ChipProps, Icon, IconButton, MenuItem, SelectProps, useTheme } from "@material-ui/core"
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons"
import { TextField } from "acp/src/components/form/inputs/text-field"
import { pascalCaseToSneakCase } from "acp/src/helpers/pascal-case-to-sneak-case"
import * as React from "react"
import * as Styled from "./styles"

export interface MultipleChipSelectOption {
  label: string
  value: React.ReactText
  icon?: string
  disabled?: boolean
}

export interface MultipleChipSelect
  extends Pick<TextField, "className" | "onChange" | "error" | "helperText" | "label" | "required"> {
  options: MultipleChipSelectOption[]
  value: React.ReactText[]
  onDeleteChip: (chip: any) => ChipProps["onDelete"]
  fixedOptions?: MultipleChipSelectOption[]
}

export const MultipleChipSelect: React.FC<MultipleChipSelect> = ({
  options,
  value = [],
  onDeleteChip,
  fixedOptions,
  ...props
}: MultipleChipSelect) => {
  const classes = Styled.useStyles()
  const theme = useTheme()
  const getStyles = (value: React.ReactText, values: React.ReactText[]) => ({
    fontWeight: !values.includes(value) ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  })
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const renderValue: SelectProps["renderValue"] = (selected: unknown) => {
    return (selected as string[]).map((value) => {
      const { label, icon } = options.find((item) => item.value === value) as MultipleChipSelectOption

      return (
        <Chip
          key={value}
          {...(icon && { icon: <Icon>{pascalCaseToSneakCase(icon)}</Icon> })}
          label={label}
          className={classes.chip}
          onDelete={onDeleteChip(value)}
          color="secondary"
          variant="outlined"
          disabled={fixedOptions?.length ? fixedOptions?.findIndex((option) => option.value === value) !== -1 : false}
        />
      )
    })
  }
  const IconComponent: SelectProps["IconComponent"] = () => (
    <IconButton className={classes.iconButton} onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
    </IconButton>
  )

  return (
    <TextField
      select
      SelectProps={{
        MenuProps: {
          open: isOpen,
          anchorOrigin: { vertical: `top`, horizontal: `center` },
          getContentAnchorEl: null,
          classes: { paper: classes.menu },
        },
        renderValue,
        classes: { root: classes.root },
        multiple: true,
        IconComponent,
        onClose: () => setIsOpen(false),
      }}
      value={value}
      {...props}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          style={getStyles(option.value, value)}
          disabled={
            option.disabled ||
            (fixedOptions?.length
              ? fixedOptions?.findIndex((fixedOption) => fixedOption.value === option.value) !== -1
              : false)
          }
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
