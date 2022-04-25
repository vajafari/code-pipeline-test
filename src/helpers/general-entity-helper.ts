/* eslint-disable @typescript-eslint/no-var-requires */
import * as entities from "acp/models/entities"
import { acpExports, EntityApiInfo } from "acp/src/acp-exports"
import * as form from "acp/src/components/form"
import { encode, encodePrimitive } from "acp/src/helpers/backend/encoder"
import { UserData } from "acp/src/helpers/hooks/use-current-user-info"
import { useAuthorizedProps } from "acp/src/helpers/hooks/use-entity"
import { apiConfig } from "acp/src/plugins"
import _ from "lodash"
import { ReactText } from "react"
type EntityName = typeof import("acp/models/entities/index")

interface getEntityApiConfigProps {
  entityName: string
  httpMethod: HttpMethod
  pathParameter?: any
  queryStringParameters?: any
}

interface filterEntityByJsonSchemaProps {
  entity: any
  entityKeys: EntityKey[]
  jsonSchema: JsonSchema
}

export const getEntityApiConfig = ({
  entityName,
  httpMethod,
  pathParameter,
  queryStringParameters,
}: getEntityApiConfigProps): apiConfig => {
  const entityApiInfo = acpExports.entities.find((entity) => entity.name === entityName) as EntityApiInfo
  const api =
    entityApiInfo?.api.find(
      (api) =>
        api.httpMethod === httpMethod && (pathParameter ? Boolean(api.pathParameter) : !Boolean(api.pathParameter)),
    ) || entityApiInfo?.api.find((api) => !Boolean(api.httpMethod))

  let apiConfigToReturn = { apiName: api?.apiName || "", path: `/${entityName}` } as apiConfig

  if (entityApiInfo?.provider === "DynamoDB") {
    if (httpMethod === "GET" && pathParameter) {
      apiConfigToReturn = {
        ...apiConfigToReturn,
        path: `${apiConfigToReturn.path}/${encodePrimitive(pathParameter)}`,
      }
    }
  } else if (entityApiInfo?.provider === "cognito") {
    if (pathParameter)
      apiConfigToReturn = {
        ...apiConfigToReturn,
        path: `${apiConfigToReturn.path}/${encodePrimitive(pathParameter)}`,
      }
  } else {
    // MongoDb
  }

  if (queryStringParameters)
    apiConfigToReturn = {
      ...apiConfigToReturn,
      params: {
        queryStringParameters: encode(queryStringParameters),
      },
    }
  return apiConfigToReturn
}

export const getEntityGetApiConfigPathParameter = (
  entity: Entity,
): { pathParameter?: string; queryStringParameters?: any } => {
  let pathParameter = undefined
  let queryStringParameters: any = undefined

  const requestParameters = entity.methodInfos.find((method) => method.httpMethod === "GET" && !method.pathParameter)
    ?.requestParameters
  const querystringRequestParameters = requestParameters?.filter((rp) => rp.location === "querystring")
  if (querystringRequestParameters) {
    queryStringParameters = {}
    querystringRequestParameters.forEach(
      (requestParameter) => (queryStringParameters[requestParameter.name] = requestParameter.name),
    )
  }

  if (!entity.needScan && entity.entityType === "DynamoDB") {
    const hashKey = entity.keys.find((key) => key.keyType === "HASH")
    const hashKeyField = entity.fields.find((field) => field.name === hashKey?.name)
    const predefinedHashKey = hashKeyField?.predefinedValue?.httpMethods.find(
      (method) => method.httpMethod === "GET" && !method.pathParameter,
    )
    if (predefinedHashKey) {
      pathParameter = `${hashKey?.name}`
    }
  }
  return { pathParameter, queryStringParameters }
}

export interface getEntityAuthenticationProps {
  entity: Entity
  httpMethod: HttpMethod
  pathParameter?: string
}
export const getEntityAuthentication = ({
  entity,
  httpMethod,
  pathParameter,
}: getEntityAuthenticationProps): AuthorizationType | undefined => {
  return entity.methodInfos.find(
    (methodInfo) => methodInfo.httpMethod === httpMethod && (pathParameter ? methodInfo.pathParameter : true),
  )?.authenticationInfo
}

export const isUserAuthorized = (permission?: AuthorizationType, user?: UserData): boolean => {
  let isAuthorized = Boolean(user)
  if (permission)
    if (permission.authenticated)
      if (permission.authorized && permission.authorized.length > 0) {
        isAuthorized = Boolean(_.intersection(permission.authorized, user?.groups || []).length)
      }
  return isAuthorized
}

export const isEntityAuthorizedForUser = ({
  entityName,
  httpMethod,
  pathParameter,
  user,
}: useAuthorizedProps): boolean => {
  const foundEntity = entities[entityName as keyof EntityName] as Entity
  return isUserAuthorized(getEntityAuthentication({ entity: foundEntity, httpMethod, pathParameter }), user)
}

export const getEntityProvider = (entityName: string): EntityType | `cognito` | undefined => {
  const entity = acpExports.entities.find((entity) => entity.name === entityName) as EntityApiInfo
  return entity?.provider
}

export const fillEntityFields = (keys: any[], entity: any): any => {
  return keys.reduce((obj: any, key) => {
    obj[key] = entity[key]
    return obj
  }, {})
}

export const getDeleteRequestQuerystringParameters = (entityObject: Entity, entityValue: any): any => {
  const deleteMethodInfo = entityObject.methodInfos.find((methodInfo) => methodInfo.httpMethod === "DELETE")
  const keys = deleteMethodInfo?.requestParameters?.filter((rp) => rp.location === "querystring").map((rp) => rp.name)
  if (keys) return fillEntityFields(keys, entityValue)
}

export const getReadRequestQuerystringParameters = (entitykeys: EntityKey[], entityValue: any): any => {
  return fillEntityFields(
    entitykeys.map((key) => key.name),
    entityValue,
  )
}

interface getAutocompleteFormFieldProps {
  jsonSchema: JsonSchema
  field: string
  multiple: boolean
  refFieldName: string
}
const getAutocompleteFormField = ({ jsonSchema, field, multiple, refFieldName }: getAutocompleteFormFieldProps) => {
  const [entityName, fieldName] = refFieldName.split(":")

  const getOptionLabel = (option: any) =>
    jsonSchema.definitions[refFieldName]["description"]
      .split(",")
      .map((field: any) => option[field])
      .join(" ")
  const getOptionSelected = (option: any, value: any) => getOptionLabel(option) === getOptionLabel(value)

  return {
    name: field,
    label: jsonSchema.properties[field]["description"] || field,
    optionValueName: fieldName,
    component: form.fieldType.Autocomplete,
    componentProps: {
      TextFieldProps: {
        required: jsonSchema.required.includes(field),
      },
      useSwrProps: {
        setApi: (searchPhrase: string) =>
          searchPhrase &&
          getEntityApiConfig({
            entityName,
            httpMethod: "GET",
            ...setSearchPhraseQueryStringParameters(entityName, searchPhrase),
          }),
        getOptions: (swrData: any) => swrData?.Items,
      },
      getOptionLabel,
      getOptionSelected,
      multiple: multiple,
    },
  }
}

export const setSearchPhraseQueryStringParameters = (
  entityName: string,
  searchPhrase: string,
): { queryStringParameters?: any; pathParameter?: string } => {
  let pathParameter = undefined
  let queryStringParameters: any = undefined

  const entity = entities[entityName as keyof EntityName] as Entity
  if (!entity.needScan && entity.entityType === "DynamoDB") {
    const hashKey = entity.keys.find((key) => key.keyType === "HASH")
    const hashKeyField = entity.fields.find((field) => field.name === hashKey?.name)
    const predefinedHashKey = hashKeyField?.predefinedValue?.httpMethods.find(
      (method) => method.httpMethod === "GET" && !method.pathParameter,
    )
    if (predefinedHashKey) {
      pathParameter = `${hashKey?.name}`
    }
  }

  const searchableFields = entity.fields.filter((field) => field.searchable)
  if (searchableFields?.length) {
    queryStringParameters = {
      operator: "OR",
    }
    searchableFields.forEach((field) => (queryStringParameters[field.name] = searchPhrase))
  }

  return { pathParameter, queryStringParameters }
}

export const getEntityFieldsFromJsonSchema = (jsonSchema: JsonSchema): form.Generator["fields"] => {
  return jsonSchema.definitions.formGeneratorFields.enum.map((field) => {
    let formGeneratorField: form.Field = {
      name: field,
      label: jsonSchema.properties[field]["description"] || field,
      component: form.fieldType.TextField,
      componentProps: {
        required: jsonSchema.required.includes(field),
      },
    }

    if (Boolean(jsonSchema.properties[field]["$ref"])) {
      const refFieldName = (jsonSchema.properties[field]["$ref"] as string).split("/")[2] as string

      if (jsonSchema.definitions[refFieldName].format === "time") {
        formGeneratorField = {
          ...formGeneratorField,
          component: form.fieldType.TimePicker,
          componentProps: {
            ...formGeneratorField.componentProps,
            clearable: !jsonSchema.required.includes(field),
          },
        }
      } else
        formGeneratorField = getAutocompleteFormField({
          jsonSchema,
          field,
          multiple: false,
          refFieldName,
        })
    } else {
      switch (jsonSchema.properties[field].type as EntityJsonSchemaFieldType) {
        case "string":
          if (jsonSchema.properties[field].enum) {
            formGeneratorField = {
              ...formGeneratorField,
              component: form.fieldType.Select,
              componentProps: {
                ...formGeneratorField.componentProps,
                options: (jsonSchema.properties[field].enum as string[]).map((option) => ({
                  value: option,
                  label: option,
                })),
              },
            }
          } else {
            if (Boolean(jsonSchema.properties[field]["minLength"]))
              formGeneratorField.componentProps.inputProps.minlength = Boolean(
                jsonSchema.properties[field]["minLength"],
              )
            if (Boolean(jsonSchema.properties[field]["maxLength"]))
              formGeneratorField.componentProps.inputProps.maxlength = Boolean(
                jsonSchema.properties[field]["maxLength"],
              )
          }
          break
        case "number":
        case "integer":
          if (jsonSchema.properties[field].enum) {
            formGeneratorField = {
              ...formGeneratorField,
              component: form.fieldType.Select,
              componentProps: {
                ...formGeneratorField.componentProps,
                options: (jsonSchema.properties[field].enum as string[]).map((option) => ({
                  value: option,
                  label: option,
                })),
              },
            }
          } else if (jsonSchema.properties[field].format === "date") {
            formGeneratorField = {
              ...formGeneratorField,
              component: form.fieldType.DatePicker,
              componentProps: {
                ...formGeneratorField.componentProps,

                clearable: !jsonSchema.required.includes(field),
              },
            }
          } else if (jsonSchema.properties[field].format === "date-time") {
            formGeneratorField = {
              ...formGeneratorField,
              component: form.fieldType.DatetimePicker,
              componentProps: {
                ...formGeneratorField.componentProps,
                clearable: !jsonSchema.required.includes(field),
              },
            }
          } else {
            formGeneratorField = {
              ...formGeneratorField,
              component: form.fieldType.TextField,
              componentProps: {
                ...formGeneratorField.componentProps,
                type: "number",
              },
            }
            if (Boolean(jsonSchema.properties[field]["minimum"]))
              formGeneratorField.componentProps.inputProps.min = Boolean(jsonSchema.properties[field]["minimum"])
            if (Boolean(jsonSchema.properties[field]["maximum"]))
              formGeneratorField.componentProps.inputProps.max = Boolean(jsonSchema.properties[field]["maximum"])
          }
          break
        case "boolean":
          formGeneratorField = {
            ...formGeneratorField,
            component: form.fieldType.Checkbox,
            componentProps: {
              ...formGeneratorField.componentProps,
            },
          }
          if (jsonSchema.properties[field]["default"] && Boolean(jsonSchema.properties[field]["default"]))
            formGeneratorField.componentProps.checked = true
          break
        case "array":
          if (jsonSchema.properties[field].items) {
            if (jsonSchema.properties[field].items.enum)
              formGeneratorField = {
                ...formGeneratorField,
                component: form.fieldType.MultipleChipSelect,
                componentProps: {
                  ...formGeneratorField.componentProps,
                  options: (jsonSchema.properties[field].items.enum as ReactText[]).map((option) => ({
                    value:
                      jsonSchema.properties[field].items.type === "number" ||
                      jsonSchema.properties[field].items.type === "integer"
                        ? Number(option)
                        : option.toString(),
                    label: option.toString(),
                  })),
                },
              }
            else if (jsonSchema.properties[field].items["$ref"]) {
              const refFieldName = (jsonSchema.properties[field].items["$ref"] as string).split("/")[2] as string
              formGeneratorField = getAutocompleteFormField({
                jsonSchema,
                field,
                multiple: true,
                refFieldName,
              })
            }
          }
          break
        default:
          break
      }
    }

    return formGeneratorField
  })
}

export const filterEntityByJsonSchema = ({ jsonSchema, entity, entityKeys }: filterEntityByJsonSchemaProps): any => {
  return _.union(
    entityKeys.map((key) => key.name),
    jsonSchema.definitions.formGeneratorFields.enum,
  ).reduce((obj: any, key) => {
    obj[key] = entity[key]
    return obj
  }, {})
}
