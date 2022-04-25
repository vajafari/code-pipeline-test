import { proxyHelperExports } from "../lambda-helpers/lambda-proxy-helper"
import { corsHeaderHelperExports } from "../lambda-helpers/cors-header-helpers"
import { cognitoHelperExports } from "../lambda-helpers/cognito-helper"

import { modelExports } from "../dynamo-db/dynamo-db-model"
import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda"

const statusCode = 500
export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false
  const convertedEvent = await cognitoHelperExports.checkAndReplaceClaims(event)
  const entityName = proxyHelperExports.getEntityName(convertedEvent)
  const method = proxyHelperExports.getHttpMethod(convertedEvent)
  const headersToInject = corsHeaderHelperExports.injectCorsHeaders(entityName, method)

  try {
    const result = await modelExports.processPut(convertedEvent)

    return proxyHelperExports.formatResponse({
      objectToReturn: result,
      headers: headersToInject,
    })
  } catch (error) {
    console.log(`Error happened on event ${JSON.stringify(convertedEvent)}`)
    console.error(error)
    return proxyHelperExports.formatError({
      status: statusCode,
      error: error as Error,
      headers: headersToInject,
    })
  }
}
