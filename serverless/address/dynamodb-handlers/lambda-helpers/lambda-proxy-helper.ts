import { AwsServiceTypes, LambdaHandlerTypes } from "acp-types"
import {
  APIGatewayEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyResult,
  SNSEvent,
  SQSEvent,
} from "aws-lambda"

const getUserSub = (event: APIGatewayEvent): string | undefined => {
  if (
    event.requestContext &&
    event.requestContext.identity &&
    event.requestContext.identity.cognitoAuthenticationType &&
    event.requestContext.identity.cognitoAuthenticationProvider &&
    event.requestContext.identity.cognitoAuthenticationType === "authenticated"
  ) {
    const resultOfSplit =
      event.requestContext.identity.cognitoAuthenticationProvider.split(
        ":CognitoSignIn:",
      )

    if (resultOfSplit.length == 2) {
      return resultOfSplit[1]
    }
  }
}

const getFederatedIdentityId = (event: APIGatewayEvent): string | undefined => {
  if (event.requestContext?.identity?.cognitoIdentityId) {
    return event.requestContext.identity.cognitoIdentityId
  }
}

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any */
const getBody = (event?: APIGatewayEvent): any | undefined => {
  if (event && event.body) {
    if (typeof event.body === "string") {
      return JSON.parse(event.body)
    } else {
      return event.body
    }
  }
}

const getPathParameters = (
  event?: APIGatewayEvent,
): APIGatewayProxyEventPathParameters | undefined => {
  if (event && event.pathParameters) {
    if (
      typeof event.pathParameters === "string" ||
      event.pathParameters instanceof String
    ) {
      return JSON.parse(
        event.pathParameters.toString(),
      ) as APIGatewayProxyEventPathParameters
    } else {
      return event.pathParameters
    }
  }
}

const getEntityName = (event: APIGatewayEvent): string => {
  let entityName = ""
  const resourceParts = event.resource.split(`/`)
  for (const part of resourceParts) {
    if (part) {
      entityName = part
      break
    }
  }
  return entityName
}

const getHttpMethod = (event: APIGatewayEvent): string => {
  return event.httpMethod.toUpperCase()
}

const formatResponse = (
  params: LambdaHandlerTypes.FormatResponseParams,
): APIGatewayProxyResult => {
  if (process.env.INTEGRATIONTYPE && process.env.INTEGRATIONTYPE === "LAMBDA") {
    return params.objectToReturn
  } else {
    const headerToInject = params.headers ? params.headers : {}
    return {
      statusCode: 200,
      headers: {
        "Content-Type": `application/json`,
        ...headerToInject,
      },
      isBase64Encoded: false,
      body: JSON.stringify(params.objectToReturn, null, 2),
    }
  }
}

const formatError = (
  params: LambdaHandlerTypes.FormatErrorParams,
): APIGatewayProxyResult => {
  if (process.env.INTEGRATIONTYPE && process.env.INTEGRATIONTYPE === "LAMBDA") {
    const myErrorObj = {
      statusCode: params.status,
      errorMessage: params.error.message,
    }
    throw new Error(JSON.stringify(myErrorObj))
  } else {
    const headerToInject = params.headers ? params.headers : {}
    return {
      statusCode: params.status,
      headers: {
        "Content-Type": `application/json`,
        ...headerToInject,
      },
      isBase64Encoded: false,
      body: JSON.stringify(
        { errorMessage: `${params.error.message}` },
        null,
        2,
      ),
    }
  }
}

const extractSnsMessage = <T>(event?: SNSEvent): T | undefined => {
  if (event && event.Records?.length) {
    if (event.Records[0].Sns.Message) {
      return JSON.parse(event.Records[0].Sns.Message) as T
    }
  }
}

const extractSqsMessage = <T extends AwsServiceTypes.QueueCommonData>(
  event?: SQSEvent,
): T[] | undefined => {
  const result: T[] = []
  if (event && event.Records?.length) {
    event.Records.forEach((record) => {
      if (record.body) {
        const currentItem: T = JSON.parse(record.body) as T
        currentItem.receiptHandle = record.receiptHandle
        result.push(currentItem)
      }
    })
  }
  return result.length ? result : undefined
}

const extractSqsMessagePure = <T>(event?: SQSEvent): T[] | undefined => {
  const result: T[] = []
  if (event && event.Records?.length) {
    event.Records.forEach((record) => {
      if (record.body) {
        const currentItem: T = JSON.parse(record.body) as T
        result.push(currentItem)
      }
    })
  }
  return result.length ? result : undefined
}

export const proxyHelperExports = {
  getUserSub,
  getFederatedIdentityId,
  getBody,
  getPathParameters,
  getEntityName,
  formatResponse,
  formatError,
  getHttpMethod,
  extractSnsMessage,
  extractSqsMessage,
  extractSqsMessagePure,
}
