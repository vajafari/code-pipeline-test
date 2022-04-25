import * as React from "react"
import { ConfirmDialogBox } from "acp/src/components/confirm-dialog-box/confirm-dialog-box"
import { TextField, Box } from "@material-ui/core"

interface Props {
  onCancel: () => any
  onConfirm: (temporrayPassword: string) => any
  userInfo: any
}
export const RenewPasswordConfirmDialogBox = (props: Props) => {
  const { onCancel, onConfirm, userInfo } = props
  const { email } = userInfo || {}
  const [temporaryPassword, setTemporaryPassword] = React.useState<string>()

  const handleCancel = () => {
    setTemporaryPassword(undefined)
    onCancel()
  }

  const handleConfirm = () => {
    setTemporaryPassword(undefined)
    temporaryPassword && onConfirm(temporaryPassword)
  }

  const dialogContent = (
    <Box marginBottom={2} marginTop={2} padding={2} display="flex" width="60%">
      <TextField
        name="temporaryPassword"
        label="Temporary password"
        value={temporaryPassword || ""}
        variant="outlined"
        fullWidth
        type="password"
        onChange={(event) => setTemporaryPassword(event?.target.value)}
      />
    </Box>
  )

  return (
    <ConfirmDialogBox
      title={`Reset temporary password`}
      contentText={`Please provide a temporary password for the user "${email}":`}
      content={dialogContent}
      confirmText="Reset Temporary Password"
      cancelText="Cancel"
      open={Boolean(userInfo)}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      confirmDisabled={!temporaryPassword}
    />
  )
}
