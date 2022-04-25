import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from "@material-ui/core"
import clsx from "clsx"
import * as React from "react"
import DialogTransitionComponent from "./dialog-transition-component"

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: `center`,
  },
  contentText: theme.typography.body2,
}))

interface ConfirmDialogBoxProps {
  open: boolean
  title?: string
  contentText?: string | React.ReactChild
  content?: React.ReactChild
  onCancel: (e: any) => any
  cancelText?: string
  onConfirm: (e: any) => any
  confirmText?: string
  confirmDisabled?: boolean
  className?: string
}
export const ConfirmDialogBox = (props: ConfirmDialogBoxProps): React.ReactElement => {
  const {
    open = false,
    title = `Confirmation`,
    contentText = `Are you sure?`,
    content,
    onCancel,
    cancelText = `No`,
    onConfirm,
    confirmText = `Yes`,
    confirmDisabled,
    className,
  } = props
  const classes = useStyles()

  return (
    <Dialog
      open={open}
      TransitionComponent={DialogTransitionComponent}
      keepMounted
      onClose={onCancel as any}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      classes={{ paper: clsx(classes.paper, className) }}
      maxWidth="md"
    >
      <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description" component="div" className={classes.contentText}>
          {contentText}
        </DialogContentText>
        {content}
      </DialogContent>
      <DialogActions>
        <Button variant={`outlined`} size={`large`} color={`secondary`} onClick={onCancel as any}>
          {cancelText}
        </Button>
        <Button
          variant={`contained`}
          size={`large`}
          color="primary"
          onClick={onConfirm as any}
          disabled={confirmDisabled}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
