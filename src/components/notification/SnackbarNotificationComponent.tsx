import { withSnackbar, WithSnackbarProps, SnackbarKey } from "notistack"
import { useEffect, useState } from "react"
import { removeNotification, useNotification, NotificationMessage } from "acp/src/helpers/hooks/use-notification-store"

const SnackbarNotificationComponent = (props: WithSnackbarProps) => {
  const { enqueueSnackbar, closeSnackbar } = props
  const { notificationMessages } = useNotification()
  const [displayed, setDisplayed] = useState<SnackbarKey[]>([])

  useEffect(() => {
    notificationMessages.forEach((notification: NotificationMessage) => {
      const { key, dismissed, options, message } = notification
      if (dismissed) {
        closeSnackbar(key)
      } else if (!displayed.includes(key)) {
        setDisplayed((displayed) => [...displayed, key])
        enqueueSnackbar(message, {
          key,
          ...options,
          onClose: (event, reason, key) => {
            if (options.onClose && event) {
              options.onClose(event, reason, key as SnackbarKey)
            }
          },
          onExited: (node, key) => {
            removeNotification(key)
            setDisplayed((displayed) => displayed.filter((displayedKey) => key !== displayedKey))
          },
        })
      }
    })
  })

  return null
}

export default withSnackbar(SnackbarNotificationComponent as any)
