import {
  DeleteItemCommand,
  DeleteItemInput,
  DynamoDBClient,
  GetItemCommand,
  GetItemInput,
  PutItemCommand,
  PutItemInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { DynamoDBTypes, LambdaHandlerTypes } from "acp-types"
import _ from "lodash"

interface DynamoDbExpression {
  Expression: string
  ExpressionAttributeNames: Record<string, string>
  /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any */
  ExpressionAttributeValues: Record<string, any>
}

interface DynamoDbProjectionExpression {
  Expression: string
  ExpressionAttributeNames: Record<string, string>
}
/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any */
const removeEmptyKeys = (obj: any): any => {
  if (obj)
    Object.entries(obj).forEach(
      ([key, val]) =>
        (val &&
          typeof val === `object` &&
          dynamodbCommonModelExports.removeEmptyKeys(val)) ||
        ((val === null || val === ``) && delete obj[key]),
    )
  return obj
}

const deleteByKey = async (
  params: DynamoDBTypes.DeleteByKeyParams,
): Promise<LambdaHandlerTypes.ObjectOrUndefined> => {
  const client = new DynamoDBClient({
    region: process.env.REGION,
  })
  const deleteItemCommandParam: DeleteItemInput = {
    TableName: params.tableName,
    Key: marshall(params.keys),
    ReturnValues: `ALL_OLD`,
  }
  const command = new DeleteItemCommand(deleteItemCommandParam)
  const data = await client.send(command)
  if (data && data.Attributes) {
    return unmarshall(data.Attributes)
  }
}

const insertNewItem = async (
  params: DynamoDBTypes.InsertNewItemParams,
): Promise<LambdaHandlerTypes.ObjectOrUndefined> => {
  const removedEmptyKeysItem = dynamodbCommonModelExports.removeEmptyKeys(
    params.item,
  )
  if (Object.keys(removedEmptyKeysItem).length > 0) {
    const client = new DynamoDBClient({
      region: process.env.REGION,
    })
    const putItemCommandParam: PutItemInput = {
      TableName: params.tableName,
      Item: marshall(removedEmptyKeysItem),
      ReturnValues: `ALL_OLD`,
      ConditionExpression: `attribute_not_exists(${params.partitionKeyName})`,
    }
    const command = new PutItemCommand(putItemCommandParam)
    const data = await client.send(command)
    if (data && data.Attributes) {
      return unmarshall(data.Attributes)
    } else {
      return removedEmptyKeysItem
    }
  } else throw new Error(`'item' required in order to insert new item.`)
}

interface extractFilterExpressionFlexibleParams {
  /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any */
  filters?: DynamoDBTypes.DynamoDbFilterFlexible[]
  operator?: DynamoDBTypes.ConditionOperator
}
const extractFilterExpressionFlexible = (
  params: extractFilterExpressionFlexibleParams,
): DynamoDbExpression | undefined => {
  if (params.filters?.length) {
    const expressions: string[] = []
    const returnObject: DynamoDbExpression = {
      Expression: ``,
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    }
    params.filters.forEach((filter) => {
      //const currentFilter = filterKey
      switch (filter.operatorType) {
        case DynamoDBTypes.OperationType.NotEqual:
          expressions.push(`#${filter.keyName} <> :${filter.keyName}`)
          break
        case DynamoDBTypes.OperationType.GreaterThan:
          expressions.push(`#${filter.keyName} > :${filter.keyName}`)
          break
        case DynamoDBTypes.OperationType.GreaterThanOrEqual:
          expressions.push(`#${filter.keyName} >= :${filter.keyName}`)
          break
        case DynamoDBTypes.OperationType.LessThan:
          expressions.push(`#${filter.keyName} < :${filter.keyName}`)
          break
        case DynamoDBTypes.OperationType.LessThanOrEqual:
          expressions.push(`#${filter.keyName} <= :${filter.keyName}`)
          break
        case DynamoDBTypes.OperationType.BeginsWith:
          expressions.push(
            `begins_with(#${filter.keyName}, :${filter.keyName})`,
          )
          break
        case DynamoDBTypes.OperationType.Equal:
        default:
          expressions.push(`#${filter.keyName} = :${filter.keyName}`)
          break
      }
      returnObject.ExpressionAttributeNames[
        `#${filter.keyName}`
      ] = `${filter.keyName}`
      returnObject.ExpressionAttributeValues[`:${filter.keyName}`] =
        filter.keyValue
    })

    let operator = "and"
    if (params?.operator && params.operator.toLowerCase() === "or") {
      operator = "or"
    }
    returnObject.Expression = _.join(expressions, ` ${operator} `)
    return returnObject
  }
}

interface extractFilterExpressionParams {
  /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any */
  filter?: Record<string, any>
  operator?: DynamoDBTypes.ConditionOperator
}
const extractFilterExpression = (
  params: extractFilterExpressionParams,
): DynamoDbExpression | undefined => {
  if (params.filter && !_.isEmpty(params.filter)) {
    const expressions: string[] = []
    const returnObject: DynamoDbExpression = {
      Expression: ``,
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    }
    for (const filterKey in params.filter) {
      if (Object.prototype.hasOwnProperty.call(params.filter, filterKey)) {
        const currentFilter = params.filter[filterKey]
        expressions.push(`#${filterKey} = :${filterKey}`)
        returnObject.ExpressionAttributeNames[`#${filterKey}`] = `${filterKey}`
        returnObject.ExpressionAttributeValues[`:${filterKey}`] = currentFilter
      }
    }

    let operator = "and"
    if (params?.operator && params.operator.toLowerCase() === "or") {
      operator = "or"
    }
    returnObject.Expression = _.join(expressions, ` ${operator} `)
    return returnObject
  }
}

const extractProjectionExpression = (
  prj?: string,
): DynamoDbProjectionExpression | undefined => {
  if (prj) {
    const expressions: string[] = []
    const returnObject: DynamoDbProjectionExpression = {
      Expression: ``,
      ExpressionAttributeNames: {},
    }
    const uniqueItems = _.uniq(prj.split(`,`).map((row) => row.trim()))
    uniqueItems.forEach((prjItem) => {
      expressions.push(`#${prjItem}prj`)
      returnObject.ExpressionAttributeNames[`#${prjItem}prj`] = `${prjItem}`
    })

    if (expressions.length) {
      returnObject.Expression = _.join(expressions, `,`)
    }

    return returnObject
  }
}
/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any */
const getItem = async (params: DynamoDBTypes.GetItemParams): Promise<any> => {
  if (params.keys && !_.isEmpty(params.keys)) {
    let extractedProjection
    if (params.prj) {
      extractedProjection =
        dynamodbCommonModelExports.extractProjectionExpression(params.prj)
    }
    const expressionAttributeNames = {
      ...((extractedProjection &&
        extractedProjection.ExpressionAttributeNames) ||
        {}),
    }
    const getItemParams: GetItemInput = {
      TableName: params.tableName,
      Key: marshall(params.keys),
      ExpressionAttributeNames: !_.isEmpty(expressionAttributeNames)
        ? expressionAttributeNames
        : undefined,
      ProjectionExpression: extractedProjection?.Expression
        ? extractedProjection.Expression
        : undefined,
    }

    const client = new DynamoDBClient({
      region: process.env.REGION,
    })

    const resultOfQuery = await client.send(new GetItemCommand(getItemParams))
    if (resultOfQuery.Item) {
      return unmarshall(resultOfQuery.Item)
    }
  } else throw new Error(`'keys' are required in order to run getItem.`)
}

const query = async (
  params: DynamoDBTypes.QueryParams,
): Promise<LambdaHandlerTypes.QueryResult> => {
  if (params.keys && !_.isEmpty(params.keys)) {
    const keyExtracted = dynamodbCommonModelExports.extractFilterExpression({
      filter: params.keys,
    })

    let extractedFilter
    let extractedProjection
    if (params.filters && !_.isEmpty(params.filters)) {
      extractedFilter = dynamodbCommonModelExports.extractFilterExpression({
        filter: params.filters,
        operator: params.operator,
      })
    }
    if (params.prj) {
      extractedProjection =
        dynamodbCommonModelExports.extractProjectionExpression(params.prj)
    }

    const expressionAttributeNames = {
      ...keyExtracted?.ExpressionAttributeNames,
      ...((extractedFilter && extractedFilter.ExpressionAttributeNames) || {}),
      ...((extractedProjection &&
        extractedProjection.ExpressionAttributeNames) ||
        {}),
    }
    const expressionAttributeValues = {
      ...keyExtracted?.ExpressionAttributeValues,
      ...((extractedFilter && extractedFilter.ExpressionAttributeValues) || {}),
    }
    const queryParams: QueryCommandInput = {
      TableName: params.tableName,
      KeyConditionExpression: keyExtracted?.Expression,
      FilterExpression: extractedFilter && extractedFilter.Expression,
      ExpressionAttributeNames: !_.isEmpty(expressionAttributeNames)
        ? expressionAttributeNames
        : undefined,
      ExpressionAttributeValues: !_.isEmpty(expressionAttributeValues)
        ? marshall(expressionAttributeValues)
        : undefined,
      ExclusiveStartKey: params.lastEvaluatedKey
        ? marshall(params.lastEvaluatedKey)
        : undefined,
      Limit: params.limit,
      ProjectionExpression: extractedProjection?.Expression
        ? extractedProjection.Expression
        : undefined,
      IndexName: params.indexName,
    }

    const client = new DynamoDBClient({
      region: process.env.REGION,
    })

    const resultOfQuery = await client.send(new QueryCommand(queryParams))
    const result: LambdaHandlerTypes.QueryResult = {
      Count: resultOfQuery.Count ? resultOfQuery.Count : 0,
      Items: [],
      LastEvaluatedKey: resultOfQuery.LastEvaluatedKey
        ? unmarshall(resultOfQuery.LastEvaluatedKey)
        : undefined,
    }
    if (resultOfQuery.Count && resultOfQuery.Items?.length) {
      resultOfQuery.Items.forEach((item) => {
        result.Items.push(unmarshall(item))
      })
    }
    return result
  } else throw new Error(`'keys' are required in order to run a query.`)
}

const queryFlexible = async (
  params: DynamoDBTypes.QueryFlexibleParams,
): Promise<LambdaHandlerTypes.QueryResult> => {
  if (params.keys?.length) {
    const keyExtracted =
      dynamodbCommonModelExports.extractFilterExpressionFlexible({
        filters: params.keys,
      })

    let extractedFilter
    let extractedProjection
    if (params.filters && !_.isEmpty(params.filters)) {
      extractedFilter =
        dynamodbCommonModelExports.extractFilterExpressionFlexible({
          filters: params.filters,
          operator: params.operator,
        })
    }
    if (params.prj) {
      extractedProjection =
        dynamodbCommonModelExports.extractProjectionExpression(params.prj)
    }

    const expressionAttributeNames = {
      ...keyExtracted?.ExpressionAttributeNames,
      ...((extractedFilter && extractedFilter.ExpressionAttributeNames) || {}),
      ...((extractedProjection &&
        extractedProjection.ExpressionAttributeNames) ||
        {}),
    }
    const expressionAttributeValues = {
      ...keyExtracted?.ExpressionAttributeValues,
      ...((extractedFilter && extractedFilter.ExpressionAttributeValues) || {}),
    }
    const queryParams: QueryCommandInput = {
      TableName: params.tableName,
      KeyConditionExpression: keyExtracted?.Expression,
      FilterExpression: extractedFilter && extractedFilter.Expression,
      ExpressionAttributeNames: !_.isEmpty(expressionAttributeNames)
        ? expressionAttributeNames
        : undefined,
      ExpressionAttributeValues: !_.isEmpty(expressionAttributeValues)
        ? marshall(expressionAttributeValues)
        : undefined,
      ExclusiveStartKey: params.lastEvaluatedKey
        ? marshall(params.lastEvaluatedKey)
        : undefined,
      Limit: params.limit,
      ProjectionExpression: extractedProjection?.Expression
        ? extractedProjection.Expression
        : undefined,
      IndexName: params.indexName,
    }

    const client = new DynamoDBClient({
      region: process.env.REGION,
    })

    const resultOfQuery = await client.send(new QueryCommand(queryParams))
    const result: LambdaHandlerTypes.QueryResult = {
      Count: resultOfQuery.Count ? resultOfQuery.Count : 0,
      Items: [],
      LastEvaluatedKey: resultOfQuery.LastEvaluatedKey
        ? unmarshall(resultOfQuery.LastEvaluatedKey)
        : undefined,
    }
    if (resultOfQuery.Count && resultOfQuery.Items?.length) {
      resultOfQuery.Items.forEach((item) => {
        result.Items.push(unmarshall(item))
      })
    }
    return result
  } else throw new Error(`'keys' are required in order to run a query.`)
}

const queryToEndFlexible = async (
  params: DynamoDBTypes.QueryFlexibleParams,
): Promise<LambdaHandlerTypes.QueryResult> => {
  const result: LambdaHandlerTypes.QueryResult = {
    Count: 0,
    Items: [],
  }
  let currentQueryParams: DynamoDBTypes.QueryFlexibleParams = params
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const resultOfQuery = await dynamodbCommonModelExports.queryFlexible(
      currentQueryParams,
    )
    result.Count += resultOfQuery.Count
    result.Items = _.concat(result.Items, resultOfQuery.Items)
    if (!resultOfQuery.LastEvaluatedKey) {
      break
    }
    currentQueryParams = {
      ...currentQueryParams,
      lastEvaluatedKey: resultOfQuery.LastEvaluatedKey,
    }
  }
  return result
}

const queryToEnd = async (
  params: DynamoDBTypes.QueryParams,
): Promise<LambdaHandlerTypes.QueryResult> => {
  const result: LambdaHandlerTypes.QueryResult = {
    Count: 0,
    Items: [],
  }
  let currentQueryParams: DynamoDBTypes.QueryParams = params
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const resultOfQuery = await dynamodbCommonModelExports.query(
      currentQueryParams,
    )
    result.Count += resultOfQuery.Count
    result.Items = _.concat(result.Items, resultOfQuery.Items)
    if (!resultOfQuery.LastEvaluatedKey) {
      break
    }
    currentQueryParams = {
      ...currentQueryParams,
      lastEvaluatedKey: resultOfQuery.LastEvaluatedKey,
    }
  }
  return result
}

const scan = async (
  params: DynamoDBTypes.ScanParams,
): Promise<LambdaHandlerTypes.QueryResult> => {
  let extractedFilter
  let extractedProjection
  if (params.filters) {
    extractedFilter = dynamodbCommonModelExports.extractFilterExpression({
      filter: params.filters,
      operator: params.operator,
    })
  }
  if (params.prj) {
    extractedProjection =
      dynamodbCommonModelExports.extractProjectionExpression(params.prj)
  }

  const expressionAttributeNames =
    extractedFilter || extractedProjection
      ? {
          ...((extractedFilter && extractedFilter.ExpressionAttributeNames) ||
            {}),
          ...((extractedProjection &&
            extractedProjection.ExpressionAttributeNames) ||
            {}),
        }
      : undefined

  const expressionAttributeValues = extractedFilter
    ? { ...extractedFilter.ExpressionAttributeValues }
    : undefined

  const scanParams: ScanCommandInput = {
    TableName: params.tableName,
    FilterExpression: extractedFilter && extractedFilter.Expression,
    ExpressionAttributeNames:
      expressionAttributeNames && !_.isEmpty(expressionAttributeNames)
        ? expressionAttributeNames
        : undefined,
    ExpressionAttributeValues:
      expressionAttributeValues && !_.isEmpty(expressionAttributeValues)
        ? marshall(expressionAttributeValues)
        : undefined,
    ExclusiveStartKey: params.lastEvaluatedKey
      ? marshall(params.lastEvaluatedKey)
      : undefined,
    Limit: params.limit,
    ProjectionExpression: extractedProjection?.Expression
      ? extractedProjection.Expression
      : undefined,
    IndexName: params.indexName,
  }

  const client = new DynamoDBClient({
    region: process.env.REGION,
  })

  const resultOfQuery = await client.send(new ScanCommand(scanParams))
  const result: LambdaHandlerTypes.QueryResult = {
    Count: resultOfQuery.Count ? resultOfQuery.Count : 0,
    Items: [],
    LastEvaluatedKey: resultOfQuery.LastEvaluatedKey
      ? unmarshall(resultOfQuery.LastEvaluatedKey)
      : undefined,
  }
  if (resultOfQuery.Count && resultOfQuery.Items?.length) {
    resultOfQuery.Items.forEach((item) => {
      result.Items.push(unmarshall(item))
    })
  }
  return result
}

const scanToEnd = async (
  params: DynamoDBTypes.ScanParams,
): Promise<LambdaHandlerTypes.QueryResult> => {
  const result: LambdaHandlerTypes.QueryResult = {
    Count: 0,
    Items: [],
  }
  let currentScanParams: DynamoDBTypes.ScanParams = params
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const resultOfScan = await dynamodbCommonModelExports.scan(
      currentScanParams,
    )
    result.Count += resultOfScan.Count
    result.Items = _.concat(result.Items, resultOfScan.Items)
    if (!resultOfScan.LastEvaluatedKey) {
      break
    }
    currentScanParams = {
      ...currentScanParams,
      lastEvaluatedKey: resultOfScan.LastEvaluatedKey,
    }
  }
  return result
}

const extractUpdateExpression = (
  /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any */
  updates?: Record<string, any>,
): DynamoDbExpression | undefined => {
  if (updates && !_.isEmpty(updates)) {
    const updatesKeys = Object.keys(updates)
    const returnObject: DynamoDbExpression = {
      Expression: `SET ${updatesKeys
        .map((key) => `#${key} = :${key}`)
        .join(`, `)}`,
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    }

    updatesKeys.forEach((updateKey) => {
      returnObject.ExpressionAttributeNames[`#${updateKey}`] = `${updateKey}`

      if (updates[updateKey] === null || updates[updateKey] === undefined) {
        returnObject.ExpressionAttributeValues[`:${updateKey}`] = null
      } else if (updates[updateKey] === false) {
        returnObject.ExpressionAttributeValues[`:${updateKey}`] = false
      } else if (updates[updateKey] === ``) {
        returnObject.ExpressionAttributeValues[`:${updateKey}`] = ``
      } else {
        returnObject.ExpressionAttributeValues[`:${updateKey}`] =
          updates[updateKey]
      }
    })

    return returnObject
  }
}

const update = async (
  params: DynamoDBTypes.UpdateParams,
): Promise<LambdaHandlerTypes.ObjectOrUndefined> => {
  if (params.keys && !_.isEmpty(params.keys)) {
    if (params.updates && !_.isEmpty(params.updates)) {
      const extractResult = dynamodbCommonModelExports.extractUpdateExpression(
        params.updates,
      )
      if (extractResult) {
        const {
          Expression,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
        } = extractResult
        const updateParams: UpdateItemCommandInput = {
          TableName: params.tableName,
          Key: marshall(params.keys),
          UpdateExpression: Expression,
          ReturnValues: `ALL_NEW`,
          ExpressionAttributeNames,
          ExpressionAttributeValues: marshall(ExpressionAttributeValues),
        }

        const client = new DynamoDBClient({
          region: process.env.REGION,
        })
        const result = await client.send(new UpdateItemCommand(updateParams))
        if (result && result.Attributes) {
          return unmarshall(result.Attributes)
        }
      } else
        throw new Error(`'updates' are required in order to run an update.`)
    } else throw new Error(`'updates' are required in order to run an update.`)
  } else throw new Error(`'keys' are required in order to run an update.`)
}

export const dynamodbCommonModelExports = {
  removeEmptyKeys,
  deleteByKey,
  insertNewItem,
  extractFilterExpression,
  extractFilterExpressionFlexible,
  extractProjectionExpression,
  getItem,
  query,
  queryFlexible,
  queryToEnd,
  queryToEndFlexible,
  scan,
  scanToEnd,
  extractUpdateExpression,
  update,
}
