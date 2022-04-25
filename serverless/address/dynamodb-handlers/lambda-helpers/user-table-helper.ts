import { DynamoDBTypes, LambdaHandlerTypes } from "acp-types"
import { dynamodbCommonModelExports } from "../dynamo-db/dynamodb-common-model"

const getUserTableName = (): string => {
  if (!process.env.ENV) {
    throw new Error(`Environment is not valid`)
  }
  if (!process.env.PROJECTNAME) {
    throw new Error(`Project name is not valid`)
  }
  return `${process.env.PROJECTNAME}-dynamodb-user-${process.env.ENV}`.toLowerCase()
}

interface searchUserParams {
  userSub: string
  metadataType: string
  prj?: string
}
const getItemByKey = async <T>(
  params: searchUserParams,
): Promise<T | undefined> => {
  const itemsInDatabase = await dynamodbCommonModelExports.getItem({
    tableName: userTableHelpers.getUserTableName(),
    keys: {
      userSub: params.userSub,
      metadataType: params.metadataType,
    },
    prj: params.prj,
  })
  if (itemsInDatabase) {
    return itemsInDatabase as T
  }
}

interface deleteUserTableRecordParams {
  userSub: string
  metadataType: string
}
const deleteUserTableRecord = async <T>(
  params: deleteUserTableRecordParams,
): Promise<T | undefined> => {
  return (await dynamodbCommonModelExports.deleteByKey({
    tableName: userTableHelpers.getUserTableName(),
    keys: {
      userSub: params.userSub,
      metadataType: params.metadataType,
    },
  })) as T
}

interface queryAllItemsWithSortKeyOperationParams {
  userSub: string
  metadataType: string
  metadataTypeOperation: DynamoDBTypes.OperationType
  prj?: string
  otherFilters?: DynamoDBTypes.DynamoDbFilterFlexible[]
}
const queryAllItemsWithSortKeyOperation = async <T>(
  params: queryAllItemsWithSortKeyOperationParams,
): Promise<T[] | undefined> => {
  const itemsInDatabase = await dynamodbCommonModelExports.queryToEndFlexible({
    tableName: userTableHelpers.getUserTableName(),
    keys: [
      {
        keyName: "userSub",
        keyValue: params.userSub,
        operatorType: DynamoDBTypes.OperationType.Equal,
      },
      {
        keyName: "metadataType",
        keyValue: params.metadataType,
        operatorType: params.metadataTypeOperation,
      },
    ],
    filters: params.otherFilters,
    prj: params.prj,
  })
  if (itemsInDatabase?.Items?.length) {
    return itemsInDatabase.Items as T[]
  }
}

const insertUserTableRecord = async <
  T extends LambdaHandlerTypes.UserTableRecord,
>(
  itemForInsert: T,
): Promise<T> => {
  return (await dynamodbCommonModelExports.insertNewItem({
    tableName: userTableHelpers.getUserTableName(),
    item: itemForInsert,
    partitionKeyName: "userSub",
  })) as T
}

export const userTableHelpers = {
  getUserTableName,
  deleteUserTableRecord,
  getItemByKey,
  queryAllItemsWithSortKeyOperation,
  insertUserTableRecord,
}
