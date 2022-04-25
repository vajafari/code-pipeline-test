import { Fade } from "@material-ui/core"
import * as React from "react"

interface DialogTransitionComponent {
  children?: React.ReactElement<any, any>
}
// eslint-disable-next-line react/display-name
const DialogTransitionComponent = React.forwardRef((props: DialogTransitionComponent, ref) => (
  <Fade ref={ref} {...props} />
))

export default DialogTransitionComponent
