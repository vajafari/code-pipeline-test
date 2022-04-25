import { pick } from "lodash"
import { responseInterface, SWRInfiniteResponseInterface } from "swr"
import { addNotification } from "acp/src/helpers/hooks/use-notification-store"
import { getAxiosMessageToDisplay } from "acp/src/helpers/error-message-helper"

export interface apiConfig {
  apiName: string
  path: string
  params?: any // amplify params
}
/**
 * @see https://github.com/vercel/swr#options
 */
export const initialConfig = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
}

export const showErrorNotification = (
  response: responseInterface<any, any> | SWRInfiniteResponseInterface,
  showErrorMessage?: boolean,
): void => {
  if (response?.error && showErrorMessage) {
    addNotification({
      options: { variant: `error` },
      message: getAxiosMessageToDisplay(response.error),
    })
  }
}

/**
 * Since we use JSON.strigify'ed `Object` as a key
 *   we need to guarantee the string is the same in different modules.
 *   JavaScript guarantees insertion order for String keys @see https://www.stefanjudis.com/today-i-learned/property-order-is-predictable-in-javascript-objects-since-es2015/
 *
 * We manually set keys to avoid random insertion order
 */
export const setSwrKey = (props: Omit<apiConfig, ""> & { [key: string]: any }): apiConfig => {
  return props && pick(props, [`apiName`, `path`, `params`])
}
