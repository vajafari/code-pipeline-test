import useSWR, { ConfigInterface } from "swr"
import { API } from "@aws-amplify/api"

import {
  apiConfig, // eslint-disable-line @typescript-eslint/no-unused-vars
  initialConfig,
  setSwrKey,
  showErrorNotification,
} from "acp/src/plugins/requests/swr/_common"

/**
 * @param initialConfig common config for useSwr
 */
const setUseSwr = (initialConfig?: ConfigInterface) => {
  return function useSwr<Data = unknown>(
    apiConfig?: apiConfig,
    configOverride?: ConfigInterface & { showErrorMessage?: boolean },
  ) {
    const { showErrorMessage, ...config } = configOverride || {}
    const modifiedConfig: ConfigInterface = { ...initialConfig, ...config }
    const response = useSWR<Data, Error>(
      apiConfig ? JSON.stringify(setSwrKey(apiConfig)) : null, // @see https://github.com/vercel/swr#conditional-fetching
      async () => {
        const response = await API.get(apiConfig?.apiName, apiConfig?.path, apiConfig?.params)
        return response
      },
      modifiedConfig,
    )

    showErrorNotification(response, showErrorMessage)

    return response
  }
}

export type useSwr<T, Multiple = false> = Multiple extends true ? { Items: T[] } : { Item: T }
export const useSwr = setUseSwr(initialConfig)
