import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummary,
  makeStyles,
  Typography,
} from "@material-ui/core"
import { merge } from "lodash"
import * as React from "react"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const useStyles = makeStyles((theme) => ({
  root: {
    width: `100%`,
    background: theme.palette.background.paper,
    boxShadow: `none`,
    border: `1px solid ${theme.palette.grey[300]}`,

    "&:before": {
      display: `none`,
    },
  },
  header: {
    background: theme.palette.grey[400],
    minHeight: 56,
  },
  details: {
    background: theme.palette.background.paper,
  },
}))

export interface Accordion extends AccordionProps {
  label: string
  className?: string
  classesAccordionDetails?: AccordionDetailsProps["classes"]
}
// eslint-disable-next-line react/display-name
export const Accordion = React.memo(({ label, children, classesAccordionDetails, ...props }: Accordion) => {
  const classes = useStyles()

  return (
    <MuiAccordion
      {...props}
      classes={{ root: classes.root }}
      square
      TransitionProps={{
        style: { visibility: `visible` }, // fixes issue with non-focusable inputs silently trigerring HTML input validation errors
      }}
    >
      <AccordionSummary classes={{ root: classes.header }} expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{label}</Typography>
      </AccordionSummary>
      <AccordionDetails classes={merge({ root: classes.details }, classesAccordionDetails || {})}>
        {children}
      </AccordionDetails>
    </MuiAccordion>
  )
})
