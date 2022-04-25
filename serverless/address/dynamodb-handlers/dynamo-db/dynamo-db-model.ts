import { DynamoDBTypes, LambdaHandlerTypes } from "acp-types"
import { APIGatewayEvent } from "aws-lambda"
import _ from "lodash"
import { proxyHelperExports } from "../lambda-helpers/lambda-proxy-helper"
import { requestHelperExports } from "../lambda-helpers/request-helper"
import { dynamodbCommonModelExports } from "./dynamodb-common-model"

const processGet = async (
  lambdaEvent: APIGatewayEvent,
): Promise<LambdaHandlerTypes.ObjectOrUndefined> => {
  const entityName = proxyHelperExports.getEntityName(lambdaEvent)
  if (!entityName || entityName === ``)
    throw new Error(`entity name is not valid`)
  const tableName = modelExports.getTableName(entityName)
  const queryStringObject = requestHelperExports.decode(
    lambdaEvent.queryStringParameters,
  )

  const pathParameters = proxyHelperExports.getPathParameters(lambdaEvent)
  if (!pathParameters || _.isEmpty(pathParameters)) {
    //Scan
    return await dynamodbCommonModelExports.scan({
      tableName: tableName,
      filters: _.omit(queryStringObject, [
        "LastEvaluatedKey",
        "limit",
        "prj",
        "indexName",
        "operator",
      ]),
      lastEvaluatedKey: queryStringObject.LastEvaluatedKey,
      limit: queryStringObject.limit,
      prj: queryStringObject.prj,
      indexName: queryStringObject.indexName,
      operator: queryStringObject.operator,
    })
  } else {
    //Query
    const keyNames = modelExports.getKeys(queryStringObject.indexName)
    let keysStructure: DynamoDBTypes.DynamodbTableKey = {}
    if (!pathParameters[`key`]) {
      throw new Error(`HASHKEY not found in path parameters`)
    }
    keysStructure = {
      [keyNames[0]]: requestHelperExports.decodePrimitive(
        pathParameters[`key`],
      ),
    }
    if (keyNames.length === 2 && queryStringObject[keyNames[1]]) {
      keysStructure[keyNames[1]] = queryStringObject[keyNames[1]]
    }
    const committedFields = keyNames
    committedFields.push(`LastEvaluatedKey`)
    committedFields.push(`limit`)
    committedFields.push(`prj`)
    committedFields.push(`indexName`)
    committedFields.push(`operator`)

    return await dynamodbCommonModelExports.query({
      tableName: tableName,
      keys: keysStructure,
      filters: _.omit(queryStringObject, committedFields),
      lastEvaluatedKey: queryStringObject.LastEvaluatedKey,
      limit: queryStringObject.limit,
      prj: queryStringObject.prj,
      indexName: queryStringObject.indexName,
      operator: queryStringObject.operator,
    })
  }
}

const processPost = async (
  lambdaEvent: APIGatewayEvent,
): Promise<LambdaHandlerTypes.ObjectOrUndefined> => {
  const entityName = proxyHelperExports.getEntityName(lambdaEvent)
  if (!entityName || entityName === ``)
    throw new Error(`Collection name is not valid`)
  const doc = proxyHelperExports.getBody(lambdaEvent)
  if (!doc || _.isEmpty(doc)) throw new Error(`No object to insert`)
  if (Array.isArray(doc)) {
    throw new Error(`cannot insert array`)
  }

  const tableName = modelExports.getTableName(entityName)
  const keyNames = modelExports.getKeys()

  return dynamodbCommonModelExports.insertNewItem({
    tableName: tableName,
    item: doc,
    partitionKeyName: keyNames[0],
  })
}

const processPut = async (
  lambdaEvent: APIGatewayEvent,
): Promise<LambdaHandlerTypes.ObjectOrUndefined> => {
  const entityName = proxyHelperExports.getEntityName(lambdaEvent)
  if (!entityName || entityName === ``)
    throw new Error(`Collection name is not valid`)
  const doc = proxyHelperExports.getBody(lambdaEvent)
  if (!doc) throw new Error(`No object to insert`)
  if (Array.isArray(doc)) {
    throw new Error(`cannot insert array`)
  }
  const tableName = modelExports.getTableName(entityName)
  const keyObject = modelExports.extractKeysFromDocument(doc)
  const keyNames = modelExports.getKeys()

  return dynamodbCommonModelExports.update({
    tableName: tableName,
    keys: keyObject,
    updates: _.omit(doc, keyNames),
  })
}

const processDelete = async (
  lambdaEvent: APIGatewayEvent,
): Promise<LambdaHandlerTypes.ObjectOrUndefined> => {
  const entityName = proxyHelperExports.getEntityName(lambdaEvent)
  if (!entityName || entityName === ``)
    throw new Error(`entity name is not valid`)
  const tableName = modelExports.getTableName(entityName)
  const queryStringObject = requestHelperExports.decode(
    lambdaEvent.queryStringParameters,
  )
  const keyObject = modelExports.extractKeysFromDocument(queryStringObject)
  return dynamodbCommonModelExports.deleteByKey({
    tableName: tableName,
    keys: keyObject,
  })
}

const getTableName = (entityName: string): string => {
  if (!process.env.ENV) {
    throw new Error(`Environment is not valid`)
  }
  if (!process.env.PROJECTNAME) {
    throw new Error(`Project name is not valid`)
  }
  return `${process.env.PROJECTNAME}-dynamodb-${entityName}-${process.env.ENV}`.toLowerCase()
}

const getKeys = (indexName?: string): string[] => {
  const keys: string[] = []
  if (indexName) {
    const indexInfo = modelExports.getIndexInfo(indexName)
    if (indexInfo?.keySchema?.length) {
      if (indexInfo.keySchema.length === 1) {
        keys.push(indexInfo.keySchema[0].name)
      } else if (indexInfo.keySchema.length >= 2) {
        if (indexInfo.keySchema[0].keyType === "HASH") {
          keys.push(indexInfo.keySchema[0].name)
          keys.push(indexInfo.keySchema[1].name)
        } else {
          keys.push(indexInfo.keySchema[1].name)
          keys.push(indexInfo.keySchema[0].name)
        }
      }
    } else {
      throw new Error(`Index info is not valid`)
    }
  } else {
    if (!process.env.HASHKEY) {
      throw new Error(`HASHKEY is not valid`)
    }
    keys.push(process.env.HASHKEY)
    if (process.env.SORTKEY) {
      keys.push(process.env.SORTKEY)
    }
  }
  return keys
}

let allIndexesInfo: DynamoDBTypes.DynamoDbIndex[]
const getIndexInfo = (
  indexName?: string,
): DynamoDBTypes.DynamoDbIndex | undefined => {
  if (indexName) {
    if (!allIndexesInfo) {
      if (process.env.INDEXINFO) {
        allIndexesInfo = JSON.parse(
          process.env.INDEXINFO,
        ) as DynamoDBTypes.DynamoDbIndex[]
      } else {
        throw new Error("Environment variable INDEXINFO not found")
      }
    }
    const currentIndexInfo = _.find(
      allIndexesInfo,
      (i) => i.indexName === indexName,
    )
    if (!currentIndexInfo) {
      throw new Error(
        `Index AnotherIndex not found in INDEXINFO. INDEXINFO data is ${JSON.stringify(
          process.env.INDEXINFO,
        )}`,
      )
    }
    return currentIndexInfo
  }
}
/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any */
const extractKeysFromDocument = (doc: any): Record<string, any> => {
  const keys = modelExports.getKeys()
  if (!doc[keys[0]]) {
    throw new Error(`HASHKEY not exists in document`)
  }
  if (keys.length > 1) {
    if (!doc[keys[1]]) {
      throw new Error(`SORTKEY not exists in document`)
    }
  }
  return _.pick(doc, keys)
}

export const modelExports = {
  processGet,
  processPost,
  processPut,
  processDelete,
  getTableName,
  getKeys,
  extractKeysFromDocument,
  getIndexInfo,
}
