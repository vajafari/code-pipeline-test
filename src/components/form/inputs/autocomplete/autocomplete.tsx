import { CircularProgress, makeStyles } from "@material-ui/core"
import MuiAutocomplete, { AutocompleteProps as MuiAutocompleteProps } from "@material-ui/lab/Autocomplete"
import { TextField } from "acp/src/components/form/inputs/text-field"
import { apiConfig, useSwr } from "acp/src/plugins"
import * as React from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
  },
  inputRoot: {
    paddingLeft: `${theme.spacing(2)}px !important`,
  },
  input: {
    padding: `${theme.spacing(0, 1, 0, 0)} !important`,
  },
}))

/**
 * @todo remove after @material-ui types are resolved
 *   - AutocompleteProps don't contain onChange, but the API does
 */
type AutocompletePropsAny = MuiAutocompleteProps<any, any, any, any>
export interface AutocompleteProps extends Omit<AutocompletePropsAny, "options"> {
  onChange?: (event: any, value: any) => void
  options?: AutocompletePropsAny["options"]
  multiple?: true | undefined
}

export interface Autocomplete extends Omit<AutocompleteProps, "classes" | "autoComplete" | "renderInput"> {
  label?: string
  renderInput?: AutocompleteProps["renderInput"]
  TextFieldProps: Pick<TextField, "autoComplete" | "helperText" | "onChange" | "required">
  useSwrProps?: {
    setApi: (query?: string) => apiConfig
    getOptions: (swrData: any) => any[]
  }
  optionValueName: string
  initialKeysToRead?: any
  onInitialValueSet: (swrDataItem: any[] | undefined) => void
}
// eslint-disable-next-line react/display-name
export const Autocomplete = React.memo(
  ({
    label,
    multiple,
    options = [],
    TextFieldProps = {},
    useSwrProps,
    value,
    optionValueName,
    initialKeysToRead,
    onInitialValueSet,
    ...props
  }: Autocomplete) => {
    const { onChange, ...TextFieldPropsFiltered } = TextFieldProps
    const classes = useStyles()
    const defaultValue = multiple ? [] : null
    const [searchPhrase, setSearchPhrase] = React.useState<any>(
      initialKeysToRead && !value ? { [optionValueName]: initialKeysToRead } : null, //to load the data on edit mode
    )
    const { data: swrData, error: swrError, isValidating } = useSwr<any>(useSwrProps?.setApi(searchPhrase))
    const TextFieldOnChange: TextField["onChange"] = (event) => {
      if (onChange) onChange(event)
      if (useSwrProps) setSearchPhrase(event.target.value ? event.target.value : null)
    }
    const defaultRenderInput: AutocompleteProps["renderInput"] = (params) => (
      <TextField
        {...params}
        {...(Boolean(useSwrProps || onChange) && {
          onChange: TextFieldOnChange,
        })}
        fullWidth
        label={label}
        {...TextFieldPropsFiltered}
        {...(isValidating && {
          InputProps: {
            ...params.InputProps,
            endAdornment: (
              <>
                {isValidating && searchPhrase && <CircularProgress color="primary" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          },
        })}
      />
    )
    const optionsModified = React.useMemo(
      (): any[] =>
        !useSwrProps || !swrData || swrError || !searchPhrase ? options || [] : useSwrProps.getOptions(swrData),
      [options, searchPhrase, swrData, swrError, useSwrProps],
    )

    //to set the loaded data on edit mode
    React.useEffect(() => {
      if (initialKeysToRead && !value) onInitialValueSet(useSwrProps?.getOptions(swrData))
    }, [swrData, useSwrProps])

    return (
      <MuiAutocomplete
        classes={classes}
        renderInput={defaultRenderInput}
        multiple={multiple as true | undefined}
        options={optionsModified}
        {...(Boolean(useSwrProps) && {
          noOptionsText: !searchPhrase ? `Please start typing` : isValidating ? `` : `No options`,
        })}
        value={value || defaultValue} // !IMPORTANT we destructure value from "props" to provide with fallback override
        {...props}
      />
    )
  },
)
