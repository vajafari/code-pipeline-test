import { TypographyOptions } from "@material-ui/core/styles/createTypography"
import { merge } from "lodash"

/**
 * @notes the naming of the fontWeights is according to the Figma Style Guide
 */
const fontWeightBold = 700
const fontWeightSemiBold = 600
const fontWeightRegular = 400
const fontWeightLight = 300

export const setTypography = (override?: TypographyOptions): TypographyOptions =>
  /**
   * deep merge of defaults with the override
   */
  merge(
    /**
     * Default values
     */
    {
      fontFamily: `soleil, Helvetica, Arial, sans-serif`,
      fontWeightBold,
      fontWeightMedium: fontWeightSemiBold,
      fontWeightRegular,
      fontWeightLight,
      h1: {
        fontWeight: fontWeightSemiBold,
        fontSize: `60px`,
        lineHeight: `76px`,
      },
      h2: {
        fontWeight: fontWeightLight,
        fontSize: `48px`,
        lineHeight: `61px`,
      },
      h3: {
        fontWeight: fontWeightBold,
        fontSize: `34px`,
        lineHeight: `43px`,
      },
      h4: {
        fontWeight: fontWeightRegular,
        fontSize: `24px`,
        lineHeight: `30px`,
      },
      h5: {
        fontWeight: fontWeightSemiBold,
        fontSize: `16px`,
        lineHeight: `18px`,
      },
      h6: {
        fontWeight: fontWeightBold,
        fontSize: `14px`,
        lineHeight: `16px`,
        letterSpacing: `1px`,
        textTransform: `uppercase`,
      },
      subtitle1: {
        fontWeight: fontWeightBold,
        fontSize: `12px`,
        lineHeight: `15px`,
        textTransform: `uppercase`,
        letterSpacing: `2px`,
      },
      subtitle2: {
        fontWeight: fontWeightSemiBold,
        fontSize: `12px`,
        lineHeight: `14px`,
      },
      overline: {
        fontWeight: fontWeightBold,
        fontSize: `10px`,
        lineHeight: `13px`,
        letterSpacing: `1.5px`,
        textTransform: `uppercase`,
      },
      body1: {
        fontWeight: fontWeightLight,
        fontSize: `14px`,
        lineHeight: `17px`,
      },
      body2: {
        fontWeight: fontWeightRegular,
        fontSize: `14px`,
        lineHeight: `17px`,
      },
      caption: {
        fontWeight: fontWeightRegular,
        fontSize: `12px`,
        lineHeight: `14px`,
      },
      button: {
        fontWeight: fontWeightBold,
        fontSize: `12px`,
        lineHeight: `16px`,
        letterSpacing: `1px`,
        textTransform: `uppercase`,
      },
    },
    override,
  )
