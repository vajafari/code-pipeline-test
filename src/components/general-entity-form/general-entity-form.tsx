import * as form from "acp/src/components/form"
import { EntityForm } from "acp/src/components/general-entity-form"
import { Routes } from "acp/src/constants/routes"
import { decodePrimitive } from "acp/src/helpers/backend/decoder"
import {
  filterEntityByJsonSchema,
  getEntityFieldsFromJsonSchema,
  isEntityAuthorizedForUser,
} from "acp/src/helpers/general-entity-helper"
import { useCurrentUserInfo } from "acp/src/helpers/hooks/use-current-user-info"
import { useAuthorizedEntity, useEntity } from "acp/src/helpers/hooks/use-entity"
import { EntityCreate, EntityUpdate, useRead } from "acp/src/services/general-entity-service"
import * as React from "react"
import { useSearchParam } from "react-use"
import { useLocation } from "wouter"

export const GeneralEntityForm: React.FC<any> = (props: any) => {
  const {
    params: { entity: entityName },
  } = props

  const [, setLocation] = useLocation()
  const user = useCurrentUserInfo()
  const readEntity = useEntity(entityName)
  const entityKeys = readEntity.keys

  const hashKeyName = entityKeys?.find((key) => key.keyType === "HASH")?.name
  const rangeKeyName = entityKeys?.find((key) => key.keyType === "RANGE")?.name
  const searchParamsHash = useSearchParam(hashKeyName || "HASH")
  const searchParamsRange = useSearchParam(rangeKeyName || "RANGE")

  const entityFilteredByKeys = {
    ...(hashKeyName && searchParamsHash ? { [hashKeyName]: decodePrimitive(searchParamsHash) } : {}),
    ...(rangeKeyName && searchParamsRange ? { [rangeKeyName]: decodePrimitive(searchParamsRange) } : {}),
  }
  const { data: swrData } =
    Object.keys(entityFilteredByKeys).length > 0
      ? useRead({ entityName, entityFilteredByKeys, entityKeys })
      : { data: undefined }
  const { Items: readItems = [] } = swrData || {}

  const reading = Boolean((searchParamsHash || searchParamsRange) && !swrData)
  const editMode = Boolean(searchParamsHash || searchParamsRange)
  const httpMethod = editMode ? "PUT" : "POST"

  const jsonSchema = readEntity.methodInfos.find((methodInfo) => methodInfo.httpMethod === httpMethod)?.jsonSchema
  const formData = jsonSchema && getEntityFieldsFromJsonSchema(jsonSchema)

  const needScan = readEntity.needScan || false
  const isViewableByUser = useAuthorizedEntity({
    entityName: entityName,
    httpMethod: "GET",
    user,
    ...(!needScan && readEntity.entityType === "DynamoDB" ? { pathParameter: "key" } : {}),
  })

  const [isCreatableOrEditableByUser, setIsCreatableOrEditableByUser] = React.useState<boolean>(false)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (user && !isLoaded) {
      setIsCreatableOrEditableByUser(
        isEntityAuthorizedForUser({
          entityName: entityName,
          httpMethod,
          user,
        }),
      )
      setIsLoaded(true)
    }
  }, [user, isLoaded])

  const handleSubmit: form.Generator["onSubmit"] = async (values) => {
    if (jsonSchema) {
      let result
      if (editMode)
        result = await EntityUpdate({
          entityName,
          entityKeys,
          entity: filterEntityByJsonSchema({
            entity: values,
            jsonSchema,
            entityKeys: entityKeys,
          }),
        })
      else result = await EntityCreate(entityName, values)

      if (!(result && result instanceof Error)) setLocation(Routes.EntityView(entityName))
    }
  }

  return isLoaded ? (
    <EntityForm
      entityName={entityName}
      displayName={readEntity.displayName}
      onSubmit={handleSubmit}
      isViewableByUser={isViewableByUser}
      isCreatableOrEditableByUser={isCreatableOrEditableByUser}
      formInitialValues={editMode ? readItems[0] : {}}
      formData={formData}
      editMode={editMode}
      reading={reading}
    />
  ) : null
}
