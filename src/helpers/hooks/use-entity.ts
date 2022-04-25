/* eslint-disable @typescript-eslint/no-var-requires */
import * as entities from "acp/models/entities"
import { acpExports } from "acp/src/acp-exports"
import { getEntityAuthentication, isUserAuthorized } from "acp/src/helpers/general-entity-helper"
import { UserData } from "acp/src/helpers/hooks/use-current-user-info"
import * as React from "react"
type EntityName = typeof import("acp/models/entities/index")

export const useEntity = (entityName: string): Entity => {
  return entities[entityName as keyof EntityName] as Entity
}

export interface useAuthorizedProps {
  entityName: string
  httpMethod: HttpMethod
  pathParameter?: string
  user?: UserData
}

export interface useEntityFilteredByJsonSchemaAndKeysProps {
  entity: any
  entityName: string
  httpMethod: HttpMethod
}

export type DisplayInfoType = Pick<Entity, "entityName" | "displayName" | "icon" | "displayOrder">
export const useAuthorizedEntities = (httpMethod: HttpMethod, user?: UserData): DisplayInfoType[] => {
  const authorizedEntitiesMemoized = React.useMemo(() => {
    const authorizedEnities: DisplayInfoType[] = []
    acpExports.entities.map((entity) => {
      const foundEntity = entities[entity.name as keyof EntityName] as Entity
      if (foundEntity) {
        const needScan = foundEntity.needScan || false

        const pathParameter =
          httpMethod === "GET" && !needScan && foundEntity.entityType === "DynamoDB" ? "key" : undefined

        const isAuthorized = isUserAuthorized(
          getEntityAuthentication({ entity: foundEntity, httpMethod, pathParameter }),
          user,
        )
        if (isAuthorized) {
          authorizedEnities.push({
            entityName: entity.name,
            displayName: foundEntity.displayName,
            icon: foundEntity.icon,
            displayOrder: foundEntity.displayOrder,
          })
        }
      }
    })
    return authorizedEnities
  }, [user, httpMethod])
  return authorizedEntitiesMemoized
}

export const useAuthorizedEntity = ({ entityName, httpMethod, pathParameter, user }: useAuthorizedProps): boolean => {
  const authorizedEntityMemoized = React.useMemo(() => {
    const foundEntity = entities[entityName as keyof EntityName] as Entity

    return isUserAuthorized(getEntityAuthentication({ entity: foundEntity, httpMethod, pathParameter }), user)
  }, [entityName, user, httpMethod])
  return authorizedEntityMemoized
}
