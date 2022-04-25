import { Chip } from "@material-ui/core"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import { ColumnType } from "acp/src/components/general-entity-view"
import { ActionsColumnRenderer } from "acp/src/components/general-entity-view/actions-column-renderer"
import { EntitiesTable } from "acp/src/components/general-entity-view/entities-table"
import { Routes } from "acp/src/constants/routes"
import { encode } from "acp/src/helpers/backend/encoder"
import {
  getDeleteRequestQuerystringParameters,
  getEntityApiConfig,
  getEntityGetApiConfigPathParameter,
  getReadRequestQuerystringParameters,
  isEntityAuthorizedForUser,
} from "acp/src/helpers/general-entity-helper"
import { useCurrentUserInfo } from "acp/src/helpers/hooks/use-current-user-info"
import { useAuthorizedEntity, useEntity } from "acp/src/helpers/hooks/use-entity"
import { useSwrInfinite } from "acp/src/plugins"
import { EntityDelete } from "acp/src/services/general-entity-service"
import * as React from "react"
import { useLocation } from "wouter"

export const GeneralEntityView: React.FC<any> = (props: any) => {
  const {
    params: { entity: entityName },
  } = props

  const readEntity = useEntity(entityName)
  const needScan = readEntity.needScan || false

  const apiGetConfig = React.useMemo(() => {
    return getEntityApiConfig({ entityName, httpMethod: "GET", ...getEntityGetApiConfigPathParameter(readEntity) })
  }, [entityName])
  const pages = useSwrInfinite<any>(apiGetConfig)

  const user = useCurrentUserInfo()

  const [isViewableByUser, setIsViewableByUser] = React.useState<boolean>(false)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (user && !isLoaded) {
      setIsViewableByUser(
        isEntityAuthorizedForUser({
          entityName: entityName,
          httpMethod: "GET",
          user,
          ...(!needScan && readEntity.entityType === "DynamoDB" ? { pathParameter: "key" } : {}),
        }),
      )
      setIsLoaded(true)
    }
  }, [user, isLoaded])

  const isDeletableByUser = useAuthorizedEntity({ entityName: entityName, httpMethod: "DELETE", user })
  const isCreatableByUser = useAuthorizedEntity({ entityName: entityName, httpMethod: "POST", user })
  const isUpdatableByUser = useAuthorizedEntity({
    entityName: entityName,
    httpMethod: "PUT",
    pathParameter: "key",
    user,
  })

  const [, setLocation] = useLocation()

  const [confirmingDialogEntityKeys, setConfirmingDialogEntityKeys] = React.useState<any>()

  const handleDialogConfirm = async () => {
    setConfirmingDialogEntityKeys(undefined)
    await EntityDelete({
      entityName,
      entityFilteredByKeys: confirmingDialogEntityKeys,
      mutate: pages.mutate,
      data: pages.data,
    })
  }
  const handleDialogCancel = () => {
    setConfirmingDialogEntityKeys(undefined)
  }

  const handleDeleteRequested = (row: any) => {
    setConfirmingDialogEntityKeys(getDeleteRequestQuerystringParameters(readEntity, row))
  }

  const handleEditRequested = (row: any) => {
    setLocation(Routes.EntityEdit(entityName, encode(getReadRequestQuerystringParameters(readEntity.keys, row))))
  }

  const renderCell = (field: EntityField): ColumnType["render"] => {
    let render: ColumnType["render"] = undefined
    if (field.type === "number-array" || field.type === "string-array")
      render = (row: any, accessor: string) => {
        return row[accessor]?.length
          ? row[accessor].map((option: string | number, index: number) => (
              <Chip key={`${index}-${option}`} label={option} variant="outlined" color={"secondary"} />
            ))
          : null
      }
    else if (field.type === "boolean")
      // eslint-disable-next-line react/display-name
      render = (row: any, accessor: string) => (row[accessor] ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />)

    return render
  }

  const columns: ColumnType[] = [
    ...readEntity.fields
      .filter((field) => field.displayOptions.list.displayType !== "noDisplay")
      .sort((a, b) => a.displayOptions.list.displayOrder! - b.displayOptions.list.displayOrder!)
      .map((field) => ({ label: field.displayName, accessor: field.name, render: renderCell(field) })),
    {
      label: `Actions`,
      accessor: `actions`,
    },
  ]
  columns.splice(
    columns.length - 1,
    1,
    ActionsColumnRenderer({
      isDeletable: isDeletableByUser,
      onDeleteRequested: handleDeleteRequested,
      isEditable: isUpdatableByUser,
      onEditRequested: handleEditRequested,
    }),
  )

  return isLoaded ? (
    <EntitiesTable
      entityName={entityName}
      displayName={readEntity.displayName}
      confirmingDialogEntityKeys={confirmingDialogEntityKeys}
      onDialogConfirm={handleDialogConfirm}
      onDialogCancel={handleDialogCancel}
      isCreatableByUser={isCreatableByUser}
      isViewableByUser={isViewableByUser}
      columns={columns}
      pages={pages}
    />
  ) : null
}
