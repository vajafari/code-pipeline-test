import MomentUtils from "@date-io/moment"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import moment from "moment"
import * as React from "react"

// eslint-disable-next-line react/display-name
export const PickersProvider = React.memo(({ children, ...props }: any) => (
  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
    {children}
  </MuiPickersUtilsProvider>
))
