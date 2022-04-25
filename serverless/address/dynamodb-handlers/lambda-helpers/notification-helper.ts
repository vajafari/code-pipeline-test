import { NotificationTypes } from "acp-types"

const getNotificationId = (
  params: NotificationTypes.NotificationIdParams,
): string => {
  let pathParametersString = ""
  if (
    params.pathParameters &&
    Object.prototype.toString.call(params.pathParameters) == "[object Object]"
  ) {
    pathParametersString = Object.keys(params.pathParameters).join(`-`)
  }
  return `${params.entityName}-${params.httpMethod}${
    pathParametersString ? `-${pathParametersString}` : ``
  }`.toLowerCase()
}

let notificationConfig: NotificationTypes.NotificationConfigData
const getNotificationConfigEnvironmentVariable = ():
  | NotificationTypes.NotificationConfigData
  | undefined => {
  if (notificationConfig) {
    return notificationConfig
  }
  if (!process.env.NOTIFICATIONCONFIG) {
    return undefined
  }
  const tempNotificationConfig = JSON.parse(
    process.env.NOTIFICATIONCONFIG,
  ) as NotificationTypes.NotificationConfigData

  if (
    !tempNotificationConfig.activeChannels?.length ||
    !tempNotificationConfig.categoryConfig?.length
  ) {
    return undefined
  }
  notificationConfig = tempNotificationConfig
  return notificationConfig
}

export const notificationHelperExports = {
  getNotificationId,
  getNotificationConfigEnvironmentVariable,
}
