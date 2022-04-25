import querystring from "querystring"

const subPath = (mainPath: string, subPath?: string): string => `${mainPath}${subPath ? `${subPath}` : ""}`
const mainRoutes = {
  Dashboard: "/dashboard",
}
export const Routes = {
  Landing: "/",
  Dashboard: mainRoutes.Dashboard,
  Auth: (passRedirectUrl = true): string => {
    const urlSearchParam = new URLSearchParams()
    urlSearchParam.append("redirectUrl", `${window.location.pathname}${window.location.search}`)
    return `/auth${passRedirectUrl ? `?${urlSearchParam.toString()}` : ""}`
  },
  EntityView: (entityName?: string): string => `${subPath(mainRoutes.Dashboard, "/view")}/${entityName || `:entity`}`,
  EntityCreate: (entityName?: string): string =>
    `${subPath(mainRoutes.Dashboard, "/editor")}/${entityName || `:entity`}`,
  EntityEdit: (entityName?: string, entityKeys?: { [name: string]: string }): string =>
    `${subPath(mainRoutes.Dashboard, "/editor")}/${entityName || `:entity`}?${querystring.stringify(entityKeys)}`,
  UsersView: `${subPath(mainRoutes.Dashboard, "/view")}/user`,
  UserCreate: `${subPath(mainRoutes.Dashboard, "/editor")}/user`,
  UserEdit: (sub?: { [name: string]: string }): string =>
    `${subPath(mainRoutes.Dashboard, "/editor")}/user?${querystring.stringify(sub) || `:sub`}`,
}
