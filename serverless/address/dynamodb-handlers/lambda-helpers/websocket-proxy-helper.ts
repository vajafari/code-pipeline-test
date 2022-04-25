import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi"
import { DynamoDBTypes, LambdaHandlerTypes } from "acp-types"
import { TextEncoder } from "util"
import { userTableHelpers } from "./user-table-helper"

interface sendDataToClientParams {
  data: LambdaHandlerTypes.WebSocketClientData
  endpoint: string
  connectionId: string
}
const sendDataToClient = async (
  params: sendDataToClientParams,
): Promise<void> => {
  const postData = JSON.stringify(params.data)
  const client = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint: params.endpoint,
  })
  const command = new PostToConnectionCommand({
    ConnectionId: params.connectionId,
    Data: new TextEncoder().encode(postData),
  })
  await client.send(command)
}

interface sendDataAndRemoveConnectionIfRequiredParams {
  data: LambdaHandlerTypes.WebSocketClientData
  connectionInfo: LambdaHandlerTypes.ClientConnectionRecord
}
const sendDataAndRemoveConnectionIfRequired = async (
  params: sendDataAndRemoveConnectionIfRequiredParams,
): Promise<void> => {
  try {
    await websocketProxyHelpers.sendDataToClient({
      connectionId: params.connectionInfo.typeIndexRangeKey,
      data: params.data,
      endpoint: params.connectionInfo.endpoint,
    })
  } catch (error) {
    console.info(
      `Error happened on send message to connection, cause is ${JSON.stringify(
        params,
      )}`,
    )
    console.error(error)
    try {
      console.log(
        "deleteParams",
        JSON.stringify(
          {
            userSub: params.connectionInfo.userSub,
            metadataType: params.connectionInfo.metadataType,
          },
          null,
          2,
        ),
      )
      await userTableHelpers.deleteUserTableRecord({
        userSub: params.connectionInfo.userSub,
        metadataType: params.connectionInfo.metadataType,
      })
    } catch (deleteError) {
      console.info(
        `Error happened on delete connection, cause is ${JSON.stringify(
          params,
        )}`,
      )
      console.error(deleteError)
    }
  }
}

interface sendDataToUserSubAndRemoveConnectionIfRequiredParams {
  data: LambdaHandlerTypes.WebSocketClientData
  userSub: string
}
const sendDataToUserSubAndRemoveConnectionIfRequired = async (
  params: sendDataToUserSubAndRemoveConnectionIfRequiredParams,
): Promise<void> => {
  const allUserConnections =
    await userTableHelpers.queryAllItemsWithSortKeyOperation<LambdaHandlerTypes.ClientConnectionRecord>(
      {
        userSub: params.userSub,
        metadataType: "connection#",
        metadataTypeOperation: DynamoDBTypes.OperationType.BeginsWith,
        otherFilters: [
          {
            keyName: "TYPE",
            keyValue: "CONNECTION",
            operatorType: DynamoDBTypes.OperationType.Equal,
          },
        ],
      },
    )
  if (allUserConnections?.length) {
    const listPromises: Promise<void>[] = []
    for (const connection of allUserConnections) {
      const sendMessageParams = {
        connectionInfo: connection,
        data: params.data,
      }
      listPromises.push(
        websocketProxyHelpers.sendDataAndRemoveConnectionIfRequired(
          sendMessageParams,
        ),
      )
    }
    await Promise.all(listPromises)
  }
}

export const websocketProxyHelpers = {
  sendDataToClient,
  sendDataAndRemoveConnectionIfRequired,
  sendDataToUserSubAndRemoveConnectionIfRequired,
}
