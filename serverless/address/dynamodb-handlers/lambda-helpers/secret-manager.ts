import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager"

const getSecret = async <T>(secretId: string): Promise<T | undefined> => {
  let secret
  const client = new SecretsManagerClient({ region: process.env.REGION })
  const getSecretCommandParam = { SecretId: secretId }
  const command = new GetSecretValueCommand(getSecretCommandParam)
  const data = await client.send(command)
  if (data && data.SecretString) {
    secret = data.SecretString
    if (typeof secret === `string`) return JSON.parse(secret)
    return secret as T
  } else return undefined
}

export const secretManagerExports = {
  getSecret,
}
