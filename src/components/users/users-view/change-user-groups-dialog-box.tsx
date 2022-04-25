import * as React from "react"
import { ConfirmDialogBox } from "acp/src/components/confirm-dialog-box/confirm-dialog-box"
import { Box } from "@material-ui/core"
import { Select } from "acp/src/components/form/inputs/select"
import { getAllUserGroups } from "acp/src/helpers/user-entity-helper"
import { UserGroupsRead } from "acp/src/services/user-service"
import { useEffectOnce } from "react-use"

interface Props {
  onCancel: () => any
  onConfirm: (currentUserGroup?: string, newUserGroup?: string) => any
  isGroupsChangeable: boolean
  userInfo: any
}
export const ChangeUserGroupsDialogBox = (props: Props) => {
  const { onCancel, onConfirm, userInfo, isGroupsChangeable } = props
  const { email, sub } = userInfo || {}
  const noGroupValue = "None"

  const [currentUserGroup, setCurrentUserGroup] = React.useState<any>()
  const [selectedUserGroup, setSelectedUserGroup] = React.useState<string>()
  const [allUserGroups, setAllUserGroups] = React.useState<
    {
      label: string
      value?: string
    }[]
  >([])

  useEffectOnce(() => {
    setAllUserGroups([
      { label: noGroupValue, value: noGroupValue },
      ...getAllUserGroups().map((group) => ({ label: group.GroupName, value: group.GroupName })),
    ])
  })

  React.useEffect(() => {
    const readUserGroups = async (userSub: string) => {
      const { Groups } = await UserGroupsRead(userSub)
      const initialSelectedGroup = Groups && Groups.length > 0 ? Groups[0].GroupName : noGroupValue
      setCurrentUserGroup(initialSelectedGroup)
      setSelectedUserGroup(initialSelectedGroup)
    }
    if (sub) readUserGroups(sub)
  }, [sub])

  const handleChange = (event: any) => {
    setSelectedUserGroup(event.target.value)
  }

  const handleCancel = () => {
    setSelectedUserGroup(noGroupValue)
    setCurrentUserGroup(undefined)
    onCancel()
  }

  const handleConfirm = () => {
    setSelectedUserGroup(noGroupValue)
    setCurrentUserGroup(undefined)
    onConfirm(
      currentUserGroup !== noGroupValue ? currentUserGroup : undefined,
      selectedUserGroup !== noGroupValue ? selectedUserGroup : undefined,
    )
  }

  const dialogContent = (
    <Box
      marginBottom={2}
      marginTop={2}
      padding={2}
      display="flex"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Select
        options={allUserGroups}
        value={selectedUserGroup || noGroupValue}
        onChange={handleChange}
        disabled={!Boolean(currentUserGroup)}
      />
    </Box>
  )

  return (
    <ConfirmDialogBox
      title={`User's Group`}
      contentText={`Assign another group to the user "${email}" by selecting from the list:`}
      content={dialogContent}
      confirmText="Change user's group"
      cancelText="Cancel"
      open={Boolean(userInfo)}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      confirmDisabled={!isGroupsChangeable}
    />
  )
}
