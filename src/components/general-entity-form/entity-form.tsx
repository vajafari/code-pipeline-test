import * as React from "react"
import { Box, Button, Typography } from "@material-ui/core"
import * as form from "acp/src/components/form"
import { Routes } from "acp/src/constants/routes"
import { Link, Router, Redirect } from "wouter"

import * as Styled from "./styles"

export interface EntityFormProps {
  entityName: string
  displayName: string
  onSubmit: (values: form.Generator["onSubmit"]) => void | Promise<any>
  isViewableByUser: boolean
  isCreatableOrEditableByUser: boolean
  formInitialValues: any
  formData: form.Field[]
  editMode: boolean
  reading: boolean
}

export const EntityForm: React.FC<any> = ({
  entityName,
  displayName,
  onSubmit,
  isViewableByUser,
  isCreatableOrEditableByUser,
  formInitialValues,
  formData,
  editMode,
  reading,
}: EntityFormProps) => {
  const classes = Styled.useStyles()

  return isCreatableOrEditableByUser ? (
    <Box width={"100%"} padding={5} display="flex" flexDirection="column" alignItems="center">
      <Box width={"50%"} display="flex" flexDirection="row" justifyContent="space-between" marginBottom={3}>
        <Typography variant="h4">{displayName}</Typography>
        {isViewableByUser && (
          <Link to={Routes.EntityView(entityName)}>
            <Button color="primary" variant="contained">
              Back to {entityName} list
            </Button>
          </Link>
        )}
      </Box>
      {isCreatableOrEditableByUser && (!editMode || !reading) && (
        <form.Generator
          enableReinitialize
          fields={formData}
          initialValues={formInitialValues}
          onSubmit={onSubmit}
          className={classes.form}
          fieldsClassName={classes.fields}
          FormControlsProps={{ title: editMode ? "Update" : "Create", submitButtonProps: { color: "secondary" } }}
        />
      )}
    </Box>
  ) : (
    <Router base={""}>
      <Redirect to={Routes.Dashboard} />
    </Router>
  )
}
