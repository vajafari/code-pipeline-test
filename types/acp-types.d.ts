// import { CognitoUserPoolSchema } from "../src/acp-exports"
declare type HttpMethod = `GET` | `POST` | `PUT` | `DELETE` | `PATCH`
type ParameterLocation = "querystring" | "path" | "header"
type DynamoDbKeyType = `HASH` | `RANGE`
type DynamoDbKeyDataType = `N` | `S` | `B`
type DynamoDbDataType = `N` | `S` | `B` | `BOOL` | `NS` | `SS` | `M` | `L`
type MongoDbKeyDataType = `I`
declare type EntityType = "DynamoDB" | "MongoDB"
declare type EntityJsonSchemaFieldType = `integer` | `number` | `string` | `boolean` | `array` | `object`
declare type EntityPredefinedFixedValue = string | number | integer | boolean

declare interface EntityKey {
  name: string
  type: DynamoDbKeyDataType | MongoDbKeyDataType
  keyType: DynamoDbKeyType
}
declare interface AuthorizationType {
  authenticated: boolean
  authorized?: string[] // User group name(s) as an array
}

declare interface JsonSchema {
  $schema: string
  type: string
  additionalProperties: boolean
  definitions: {
    formGeneratorFields: { enum: string[] }
    [key: string]: any
  }
  properties: any
  required: string[]
}

declare interface UserGroup {
  GroupName: string
  Precedence: number
}

declare interface DynamoDbIndex {
  indexType: "LOCAL" | "GLOBAL"
  indexName: string
  keySchema: EntityKey[]
  projection: DynamoDBIndexProjection
}

declare type NotificationType = "customLambda" | "printToBucket" | "userNotification"
declare interface NotificationInfo {
  notificationType: NotificationType
}

declare type cognitoAdminApiSecuritySettingAction =
  | "listUsers"
  | "adminCreateUser"
  | "adminDeleteUser"
  | "adminGetUser"
  | "adminUpdateUserAttributes"
  | "adminDisableUser"
  | "adminEnableUser"
  | "adminSetUserPassword"
  | "adminRemoveUserFromGroup"
  | "adminListGroupsForUser"
  | "adminAddUserToGroup"

declare type IndexProjectionType = "ALL" | "INCLUDE" | "KEYS_ONLY"
declare interface DynamoDBIndexProjection {
  NonKeyAttributes?: string[]
  ProjectionType: IndexProjectionType
}

declare type ParameterLocation = "querystring" | "path" | "header"
declare interface RequestParameter {
  location: ParameterLocation
  name: string
  required: boolean
}

declare interface EntityInitialized {
  entityPath: string
  entityName: string
  entityType: EntityType
  keys: EntityKey[]
  dynamoDbIndexes?: DynamoDbIndex[]
  methodInfos: MethodInitialized[]
}

declare interface MethodInitialized {
  httpMethod: HttpMethod
  pathParameter?: string
  requestParameters?: RequestParameter[]
  jsonSchema?: any
  requestMapping?: any
  responseMapping?: any
  entityValidation: any
  needSeparatedLambda: any
  authenticationInfo: AuthorizationType
  isCorsEnabled: boolean
  notificationInfo?: NotificationInfo[]
}

declare interface MethodInfo extends Omit<MethodInitialized, "entityValidation" | "needSeparatedLambda"> {
  needSeparatedLambda: boolean
}

declare type DisplayType = "noDisplay" | "displayOptional" | "displayRequired"
declare interface DisplayOptions {
  displayType: DisplayType
  displayOrder?: number
}

declare type EntityFieldType =
  | `string`
  | `integer`
  | `number`
  | `string-array`
  | `number-array`
  | `boolean`
  | `object`
  | `object-array`
  | `date`
  | `time`
  | `date-time`

declare interface EntityField {
  name: string
  displayName: string
  type: EntityFieldType
  options?: string[] | number[] //this is for string,stringArray,integer,number,numberArray types
  //when the field is a reference of another entity's fields
  reference?: {
    entity: string
    field: string
    displayLabels: string[]
  }
  properties?: EntityField[] //only available for object and object-array and it's required
  displayOptions: {
    create: DisplayOptions
    edit: DisplayOptions
    list: DisplayOptions
  }
  searchable?: boolean // only for MongoDB and string,integer,number types -> to include in mapping for searchPhrase
  predefinedValue?: {
    predefinedField:
      | "request_time_epoch"
      | "user_sub"
      | "user_group"
      | "custom_fixed"
      | `address`
      | `birthdate`
      | `email`
      | `email_verified`
      | `family_name`
      | `gender`
      | `given_name`
      | `locale`
      | `middle_name`
      | `name`
      | `nickname`
      | `phone_number`
      | `phone_number_verified`
      | `picture`
      | `preferred_username`
      | `profile`
      | `updated_at`
      | `website`
      | `zoneinfo`
    // predefinedField: CognitoUserPoolSchema | "request_time_epoch" | "user_sub" | "user_group" | "custom_fixed"
    fixedValue?: EntityPredefinedFixedValue
    httpMethods: {
      httpMethod: HttpMethod
      pathParameter?: string
    }[]
  }
}

declare interface Entity extends Omit<EntityInitialized, "methodInfos" | "entityPath"> {
  displayName: string
  icon?: string
  displayOrder: number // one-based number to show in menu by order
  fields: EntityField[]
  needScan?: boolean // only for DynamoDB (GET method)
  methodInfos: MethodInfo[]
}
