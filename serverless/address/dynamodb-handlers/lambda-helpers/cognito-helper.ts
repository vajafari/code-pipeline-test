import {
  AdminGetUserCommand,
  AdminGetUserCommandInput,
  AdminGetUserCommandOutput,
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
  GroupType,
  ListUsersInGroupCommand,
  ListUsersInGroupCommandInput,
  ListUsersInGroupCommandOutput,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider"
import { LambdaHandlerTypes } from "acp-types"
import { APIGatewayEvent } from "aws-lambda"
import Handlebars from "handlebars"
import _ from "lodash"
import { proxyHelperExports } from "./lambda-proxy-helper"

const checkAndReplaceClaims = async (
  event: APIGatewayEvent,
): Promise<APIGatewayEvent> => {
  const eventString = JSON.stringify(event)
  const userSub = proxyHelperExports.getUserSub(event)
  if (userSub) {
    const hasUserClaim = /\{{2}user\.([^}]+)\}{2}/gim.test(eventString)
    const hasGroupClaim = /\{{2}group\.([^}]+)\}{2}/gim.test(eventString)
    if (hasUserClaim || hasGroupClaim) {
      let cognitoUser: LambdaHandlerTypes.FlattenedCognitoUser | undefined
      let cognitoGroup: GroupType | undefined
      if (hasUserClaim) {
        cognitoUser = await cognitoHelperExports.readAndFlattenUser(userSub)
      }
      if (hasGroupClaim) {
        cognitoGroup = await cognitoHelperExports.readGroupOfUser(userSub)
      }
      const handleBarInfo = {
        user: cognitoUser ? cognitoUser : {},
        group: cognitoGroup ? cognitoGroup : {},
      }

      const template = Handlebars.compile(eventString)
      const finalEntityStructure = template(handleBarInfo)
      return JSON.parse(finalEntityStructure)
    }
  }
  return event
}

const readUser = async (sub: string): Promise<UserType | undefined> => {
  const client = new CognitoIdentityProviderClient({
    region: process.env.REGION,
  })

  const commandGetUserParams: AdminGetUserCommandInput = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: sub,
  }
  const commandGetUser = new AdminGetUserCommand(commandGetUserParams)
  const resultOfAdminGetUser: AdminGetUserCommandOutput = await client.send(
    commandGetUser,
  )
  if (resultOfAdminGetUser) {
    return {
      Attributes: resultOfAdminGetUser.UserAttributes,
      Enabled: resultOfAdminGetUser.Enabled,
      MFAOptions: resultOfAdminGetUser.MFAOptions,
      UserCreateDate: resultOfAdminGetUser.UserCreateDate,
      UserLastModifiedDate: resultOfAdminGetUser.UserLastModifiedDate,
      UserStatus: resultOfAdminGetUser.UserStatus,
      Username: resultOfAdminGetUser.Username,
    }
  }
}

const readAndFlattenUser = async (
  sub: string,
): Promise<LambdaHandlerTypes.FlattenedCognitoUser | undefined> => {
  const user = await cognitoHelperExports.readUser(sub)
  if (user) {
    return cognitoHelperExports.flattenUser(user)
  }
}

const readGroupOfUser = async (sub: string): Promise<GroupType | undefined> => {
  const client = new CognitoIdentityProviderClient({
    region: process.env.REGION,
  })

  const commandListGroupOfUserParams = {
    UserPoolId: process.env.USER_POOL_ID /* required */,
    Username: sub,
  }
  const commandListGroupOfUser = new AdminListGroupsForUserCommand(
    commandListGroupOfUserParams,
  )
  const allGroupsOfUser = await client.send(commandListGroupOfUser)
  if (
    allGroupsOfUser &&
    allGroupsOfUser.Groups &&
    allGroupsOfUser.Groups.length > 0
  ) {
    return _.sortBy(
      allGroupsOfUser.Groups,
      (group) => group.Precedence || Number.MAX_SAFE_INTEGER,
    )[0]
  }
}

const readAllGroupsOfUser = async (
  sub: string,
): Promise<GroupType[] | undefined> => {
  const client = new CognitoIdentityProviderClient({
    region: process.env.REGION,
  })

  const commandListGroupOfUserParams = {
    UserPoolId: process.env.USER_POOL_ID /* required */,
    Username: sub,
  }
  const commandListGroupOfUser = new AdminListGroupsForUserCommand(
    commandListGroupOfUserParams,
  )
  const allGroupsOfUser = await client.send(commandListGroupOfUser)
  if (
    allGroupsOfUser &&
    allGroupsOfUser.Groups &&
    allGroupsOfUser.Groups.length > 0
  ) {
    return allGroupsOfUser.Groups
  }
}

const flattenUser = (
  user: UserType,
): LambdaHandlerTypes.FlattenedCognitoUser => {
  const result: LambdaHandlerTypes.FlattenedCognitoUser = {
    Enabled: user.Enabled,
    MFAOptions: user.MFAOptions,
    UserCreateDate: user.UserCreateDate,
    UserLastModifiedDate: user.UserLastModifiedDate,
    UserStatus: user.UserStatus,
    Username: user.Username,
  }
  if (user.Attributes?.length) {
    user.Attributes.forEach((attribute) => {
      if (attribute.Name) {
        result[attribute.Name] = attribute.Value
      }
    })
  }
  return result
}

const readAllUsersOfGroup = async (
  groupName: string,
): Promise<LambdaHandlerTypes.FlattenedCognitoUser[]> => {
  const result: LambdaHandlerTypes.FlattenedCognitoUser[] = []
  const client = new CognitoIdentityProviderClient({
    region: process.env.REGION,
  })
  let nextToken: string | undefined = undefined
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const commandParams: ListUsersInGroupCommandInput = {
      UserPoolId: process.env.USER_POOL_ID,
      GroupName: groupName,
      NextToken: nextToken,
    }
    const command = new ListUsersInGroupCommand(commandParams)
    const resultOfReadUser: ListUsersInGroupCommandOutput = await client.send(
      command,
    )
    if (resultOfReadUser?.Users?.length) {
      resultOfReadUser.Users.forEach((user) => {
        result.push(cognitoHelperExports.flattenUser(user))
      })
    }
    if (resultOfReadUser?.NextToken) {
      nextToken = resultOfReadUser.NextToken
    } else {
      break
    }
  }

  return result
}

export const cognitoHelperExports = {
  readAndFlattenUser,
  readUser,
  readGroupOfUser,
  flattenUser,
  readAllGroupsOfUser,
  readAllUsersOfGroup,
  checkAndReplaceClaims,
}
