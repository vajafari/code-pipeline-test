import { getEntityApiConfig } from "acp/src/helpers/general-entity-helper"
import * as ServiceFactory from "acp/src/helpers/service-factory"
import { responseInterface, useSwr } from "acp/src/plugins"

export interface EntityDeleteProps {
  entityName: string
  entityFilteredByKeys: any
  mutate?: (newData: any, shouldRevalidate: boolean) => void
  data?: { Items: any[]; LastEvaluatedKey: any }[]
}

export interface EntityReadProps {
  entityName: string
  entityFilteredByKeys: any
  entityKeys: EntityKey[]
}

export interface EntityUpdateProps {
  entityName: string
  entity: any
  entityKeys: EntityKey[]
}

export const useGet = (entityName: string): responseInterface<{ Items: any[] }, Error> =>
  useSwr<useSwr<any, true>>(getEntityApiConfig({ entityName, httpMethod: "GET" }), { showErrorMessage: true })

export const useRead = ({
  entityName,
  entityFilteredByKeys,
  entityKeys,
}: EntityReadProps): responseInterface<{ Items: any[] }, Error> => {
  return useSwr<useSwr<any, true>>(
    getEntityApiConfig({
      entityName,
      httpMethod: "GET",
      pathParameter: entityFilteredByKeys[entityKeys?.find((key) => key.keyType === "HASH")?.name || "HASH"],
      queryStringParameters: entityFilteredByKeys[entityKeys?.find((key) => key.keyType === "RANGE")?.name || "RANGE"],
    }),
    {
      showErrorMessage: true,
    },
  )
}

export const EntityDelete = async ({
  entityName,
  entityFilteredByKeys,
  mutate,
  data,
}: EntityDeleteProps): Promise<any> => {
  await ServiceFactory.Delete({
    ...getEntityApiConfig({
      entityName,
      httpMethod: "DELETE",
      queryStringParameters: entityFilteredByKeys,
    }),
    showErrorMessage: true,
    mutations:
      Boolean(mutate) && Boolean(data)
        ? {
            mutate,
            data,
            findIndex: (items?: any[]) =>
              items?.findIndex((i) =>
                Object.keys(entityFilteredByKeys).every((key) => entityFilteredByKeys[key] === i[key]),
              ),
          }
        : {
            mutationKeys: [getEntityApiConfig({ entityName, httpMethod: "GET" })], //If we want to use this option, we need to pass the exact original apiConfig in order for it to mutate
            findIndex: (items?: any[]) =>
              items?.findIndex((i) =>
                Object.keys(entityFilteredByKeys).every((key) => entityFilteredByKeys[key] === i[key]),
              ),
          },
  })
}

export const EntityCreate = async (entityName: string, entity: any): Promise<any> =>
  await ServiceFactory.Create({
    ...getEntityApiConfig({ entityName, httpMethod: "POST" }),
    item: entity,
    showErrorMessage: true,
  })

export const EntityUpdate = async ({ entityName, entity, entityKeys }: EntityUpdateProps): Promise<any> =>
  await ServiceFactory.Update({
    ...getEntityApiConfig({ entityName, httpMethod: "PUT" }),
    item: entity,
    method: "put",
    showErrorMessage: true,
    readSwrParams: (updatedItem: any) => ({
      ...getEntityApiConfig({
        entityName,
        httpMethod: "GET",
        pathParameter: entity[entityKeys?.find((key) => key.keyType === "HASH")?.name || "HASH"],
        queryStringParameters: entity[entityKeys?.find((key) => key.keyType === "RANGE")?.name || "RANGE"],
      }),
    }),
  })
