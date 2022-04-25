import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme"
import { merge } from "lodash"

const white = `#fff`

export const setPalette = (override: ThemeOptions["palette"]): ThemeOptions["palette"] =>
  /**
   * deep merge of defaults with the override
   */
  merge(
    /**
     * light & dark colors are generated
     * @see https://material.io/resources/color
     *
     * Default values
     */
    {
      text: {
        primary: `#242528`,
      },
      background: {
        paper: white,
        default: white,
      },
      primary: {
        main: `#2151A8`,
      },
      secondary: {
        main: `#CC8A00`,
      },
      error: {
        main: `#EB5757`,
      },
      success: {
        main: `#6FCF97`,
      },
      grey: {
        100: `#96989C`,
        200: `#D3D6DC`,
        300: `#ECECEC`,
        400: `#F8F8F9`,
      },
    },
    override,
  )
