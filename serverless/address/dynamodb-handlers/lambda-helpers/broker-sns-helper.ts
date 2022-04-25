import { AwsServiceTypes, NotificationTypes } from "acp-types"
import { APIGatewayEvent } from "aws-lambda"
import { proxyHelperExports } from "./lambda-proxy-helper"
import { notificationHelperExports } from "./notification-helper"
import { snsHelperExports } from "./sns-helper"

interface notificationParams {
  entityName: string
  httpMethod: string
  userSub?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notificationData?: any
  event: APIGatewayEvent
}
const publishMessage = async (
  params: notificationParams,
): Promise<string | undefined> => {
  try {
    if (process.env.NOTIFICATIONBROKERARN) {
      const notificationConfig =
        notificationHelperExports.getNotificationConfigEnvironmentVariable()
      if (notificationConfig) {
        const message: NotificationTypes.BrokerNotificationDataPure = {
          entityName: params.entityName,
          httpMethod: params.httpMethod,
          notificationData: params.notificationData,
          pathParameters: proxyHelperExports.getPathParameters(params.event),
          userSub: params.userSub,
          trackingId: brokerSnsHelperExports.getTrackingId({
            entityName: params.entityName,
            httpMethod: params.httpMethod,
            notificationData: params.notificationData,
          }),
        }
        return await snsHelperExports.publishMessageToSnsTopic({
          messageBody: JSON.stringify(message),
          topicArn: process.env.NOTIFICATIONBROKERARN,
          messageAttributes: brokerSnsHelperExports.getMessageAttributes({
            entityName: params.entityName,
            httpMethod: params.httpMethod,
            pathParameters: params.event.pathParameters
              ? params.event.pathParameters
              : undefined,
          }),
          messageGroupId: notificationConfig.isFifo
            ? params.entityName
            : undefined,
        })
      } else {
        console.error(
          `Notification config is empty and cannot push message to the Broker topic. Error cause is ${JSON.stringify(
            params,
          )} and environment variables are data is ${JSON.stringify(
            process.env,
          )}`,
        )
      }
    } else {
      console.error(
        `NOTIFICATIONBROKERARN is empty and cannot push message to the Broker topic. Error cause is ${JSON.stringify(
          params,
        )} and environment variables are data is ${JSON.stringify(
          process.env,
        )}`,
      )
    }
  } catch (error) {
    console.error(error, params)
  }
}

const getMessageAttributes = (
  params: NotificationTypes.NotificationIdParams,
): AwsServiceTypes.SnsMessageAttribute => {
  return {
    entitymethodpath: {
      DataType: `String`,
      StringValue: notificationHelperExports.getNotificationId(params),
    },
  }
}

const getTrackingId = (
  params: NotificationTypes.GetTrackingIdParams,
): string | undefined => {
  if (!Array.isArray(params.notificationData)) {
    switch (process.env.ENTITYTYPE) {
      case "DynamoDB":
        if (process.env.HASHKEY) {
          if (process.env.SORTKEY) {
            return `${params.entityName}_${params.httpMethod}_${
              params.notificationData[process.env.HASHKEY]
            }|${params.notificationData[process.env.SORTKEY]}`.toLowerCase()
          } else {
            return `${params.entityName}_${params.httpMethod}_${
              params.notificationData[process.env.HASHKEY]
            }`.toLowerCase()
          }
        }
        break
      case "MongoDB":
        return `${params.entityName}_${params.httpMethod}_${params.notificationData._id}`.toLowerCase()
    }
  }
}

export const brokerSnsHelperExports = {
  getMessageAttributes,
  publishMessage,
  getTrackingId,
}
