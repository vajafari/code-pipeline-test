import { CognitoUserInterface } from "@aws-amplify/ui-components"
import { getEntityApiConfig } from "acp/src/helpers/general-entity-helper"
import * as ServiceFactory from "acp/src/helpers/service-factory"
import { useSwr, responseInterface } from "acp/src/plugins"

export interface UserDeleteProps {
  sub: string
  mutate?: (newData: any, shouldRevalidate: boolean) => void
  data?: { Items: any[]; LastEvaluatedKey: any }[]
}

export interface UserChangeGroupProps {
  sub: string
  currentUserGroup?: string
  newUserGroup?: string
}

export const UserDelete = async ({ sub, mutate, data }: UserDeleteProps): Promise<any> => {
  await ServiceFactory.Delete({
    ...getEntityApiConfig({
      entityName: "user",
      httpMethod: "DELETE",
      pathParameter: sub,
    }),
    showErrorMessage: true,
    mutations:
      Boolean(mutate) && Boolean(data)
        ? {
            mutate,
            data,
            findIndex: (items?: any[]) =>
              items?.findIndex(
                (i) =>
                  i.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "sub")?.Value ===
                  sub,
              ),
          }
        : {
            mutationKeys: [getEntityApiConfig({ entityName: "user", httpMethod: "GET" })],
            findIndex: (items?: any[]) =>
              items?.findIndex(
                (i) =>
                  i.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "sub")?.Value ===
                  sub,
              ),
          },
  })
}

export const useRead = (sub: string): responseInterface<any, Error> => {
  return useSwr<useSwr<any, true>>(
    getEntityApiConfig({
      entityName: "user",
      httpMethod: "GET",
      pathParameter: sub,
    }),
    {
      showErrorMessage: true,
    },
  )
}

export const UserUpdate = async (sub: string, user: Partial<CognitoUserInterface>): Promise<any> =>
  await ServiceFactory.Update({
    ...getEntityApiConfig({ entityName: "user", httpMethod: "PATCH", pathParameter: sub }),
    item: user,
    method: "patch",
    showErrorMessage: true,
    readSwrParams: (updatedItem) => ({
      ...getEntityApiConfig({
        entityName: "user",
        httpMethod: "GET",
        pathParameter: sub,
      }),
    }),
  })

export const UserRenewTemporaryPassword = async (sub: string, password: string): Promise<any> => {
  const apiConfig = getEntityApiConfig({ entityName: "user", httpMethod: "PATCH", pathParameter: sub })
  return await ServiceFactory.Update({
    ...apiConfig,
    path: `${apiConfig.path}/renewpass`,
    item: { Password: password },
    method: "patch",
    showErrorMessage: true,
    successMessage: `User's password has been set to ${password} successfully`,
  })
}

export interface UserToggleEnabledProps {
  sub: string
  enabled: boolean
  mutate?: (newData: any, shouldRevalidate: boolean) => void
  data?: { Items: any[]; LastEvaluatedKey: any }[]
}
export const UserToggleEnabled = async ({ sub, enabled, mutate, data }: UserToggleEnabledProps): Promise<any> => {
  const apiConfig = getEntityApiConfig({ entityName: "user", httpMethod: "PATCH", pathParameter: sub })
  return await ServiceFactory.Update({
    ...apiConfig,
    path: `${apiConfig.path}/${enabled ? "disable" : "enable"}`,
    method: "patch",
    item: { Enabled: !enabled },
    showErrorMessage: true,
    extraMutations:
      Boolean(mutate) && Boolean(data)
        ? {
            mutate,
            data,
            findIndex: (items?: any[]) =>
              items?.findIndex(
                (i) =>
                  i.Attributes.find((attribute: { Name: string; Value: any }) => attribute.Name === "sub")?.Value ===
                  sub,
              ),
          }
        : undefined,
  })
}

export const UserGroupsRead = async (sub: string): Promise<any> => {
  const apiConfig = getEntityApiConfig({
    entityName: "user",
    httpMethod: "GET",
    pathParameter: sub,
  })
  return await ServiceFactory.Get({ ...apiConfig, path: `${apiConfig.path}/group`, showErrorMessage: true })
}

export const UserChangeGroup = async ({ sub, currentUserGroup, newUserGroup }: UserChangeGroupProps): Promise<any> => {
  if (currentUserGroup !== newUserGroup) {
    if (Boolean(currentUserGroup)) {
      const apiConfig = getEntityApiConfig({
        entityName: "user",
        httpMethod: "DELETE",
        pathParameter: sub,
      })
      await ServiceFactory.Delete({
        ...apiConfig,
        path: `${apiConfig.path}/group`,
        params: { body: { GroupName: currentUserGroup } },
        showErrorMessage: true,
        successMessage: `user's group has been removed successfully`,
      })
    }
    if (Boolean(newUserGroup)) {
      const apiConfig = getEntityApiConfig({
        entityName: "user",
        httpMethod: "POST",
        pathParameter: sub,
      })
      await ServiceFactory.Create({
        ...apiConfig,
        path: `${apiConfig.path}/group`,
        item: { GroupName: newUserGroup },
        showErrorMessage: true,
        successMessage: `user's group has been added successfully`,
      })
    }
  }
}
