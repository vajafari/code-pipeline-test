import * as React from "react"
import { Box, LinearProgress, Button, Typography } from "@material-ui/core"
import { VirtualizerTable, Column } from "acp/src/components/virtualizer/table"
import DeleteConfirmDialogBox from "acp/src/components/confirm-dialog-box/delete-confirm-dialog-box"
import { Link, Redirect, Router } from "wouter"
import { Routes } from "acp/src/constants/routes"
import * as Styled from "./styles"

export interface Pages {
  isValidating: boolean
  items: any[]
  nextPage?: string
  loadMore?: () => void
}

export interface ColumnType {
  label: string
  accessor: string
  render?: Column["render"]
}

export interface EntitiesTable {
  entityName: string
  displayName: string
  confirmingDialogEntityKeys: { [name: string]: any }
  onDialogConfirm: (e: any) => any
  onDialogCancel: (e: any) => any
  isCreatableByUser: boolean
  isViewableByUser: boolean
  columns: ColumnType[]
  pages: Pages
}
export const EntitiesTable: React.FC<any> = ({
  entityName,
  displayName,
  confirmingDialogEntityKeys,
  onDialogConfirm,
  onDialogCancel,
  isCreatableByUser,
  isViewableByUser,
  columns,
  pages,
}: EntitiesTable) => {
  const classes = Styled.useStyles()

  return isViewableByUser ? (
    <Box width={`100%`} padding={5} flexDirection="column" display="flex" flexGrow={1}>
      <DeleteConfirmDialogBox
        confirmingEntityKeys={confirmingDialogEntityKeys}
        onConfirm={onDialogConfirm}
        onCancel={onDialogCancel}
        entityName={displayName}
      />
      <Box display="flex" flexDirection="row" justifyContent="space-between" marginBottom={3}>
        <Typography variant="h4">{displayName}</Typography>
        {isCreatableByUser && (
          <Link to={Routes.EntityCreate(entityName)}>
            <Button color="secondary" variant="contained">
              Add new {entityName}
            </Button>
          </Link>
        )}
      </Box>
      <LinearProgress variant={pages.isValidating ? `indeterminate` : `determinate`} value={100} color="primary" />
      <VirtualizerTable
        className={classes.table}
        data={pages.items}
        columns={columns}
        VirtualizerProps={
          Boolean(pages.nextPage)
            ? {
                disableLoadMore: pages.isValidating,
                loadMore: pages.loadMore,
                nextPage: pages.nextPage,
              }
            : undefined
        }
      />
    </Box>
  ) : (
    <Router base={""}>
      <Redirect to={Routes.Dashboard} />
    </Router>
  )
}
