import { ReactText, SyntheticEvent } from "react"
import { cleanObjKeys, setPropsAssign, setUseStore } from "acp/src/helpers/store-factory"

export interface NotificationMessage {
  key: ReactText
  dismissed?: boolean
  message: string
  options: {
    variant: `error` | `success` | `warning`
    onClose?(event: SyntheticEvent, reason: string, key: NotificationMessage["key"]): void
    onExited?(event: string, key: NotificationMessage["key"]): void
  }
}

interface NotificationStore {
  notificationMessages: NotificationMessage[]
}

interface addNotificaion extends Omit<NotificationMessage, "key"> {
  key?: NotificationMessage["key"]
}

const notificationStore: NotificationStore = { notificationMessages: [] }
const { useStore, updateListeners } = setUseStore(notificationStore)
export const useNotification = useStore
export const setNotification = (props?: NotificationStore): void => {
  if (props) setPropsAssign<NotificationStore, NotificationStore>(notificationStore, props)
  else cleanObjKeys(notificationStore)
  updateListeners()
}

export const removeNotification = (key: NotificationMessage["key"]): boolean => {
  const foundIndex = notificationStore.notificationMessages.findIndex(
    (existingNotification) => existingNotification.key === key,
  )

  if (foundIndex >= 0) {
    notificationStore.notificationMessages.splice(foundIndex, 1)
    updateListeners()
    return true
  } else return false
}

export const addNotification = (notification: addNotificaion): void => {
  const key = notification.key || `${notification.options.variant}-${notification.message}`
  notification.key = key

  removeNotification(notification.key)

  notificationStore.notificationMessages.push(notification as NotificationMessage)
  updateListeners()
}

export const dismissNotification = (key?: NotificationMessage["key"]): void => {
  notificationStore.notificationMessages.forEach((notification) => {
    notification.dismissed = notification.key === (key || notification.key)
  })
  updateListeners()
}
