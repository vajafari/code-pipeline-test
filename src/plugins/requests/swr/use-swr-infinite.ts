import * as React from "react"
import { SWRInfiniteConfigInterface, useSWRInfinite } from "swr"
import { encode } from "acp/src/helpers/backend/encoder"
import { API } from "@aws-amplify/api"

import {
  apiConfig, // eslint-disable-line @typescript-eslint/no-unused-vars
  initialConfig,
  setSwrKey,
  showErrorNotification,
} from "acp/src/plugins/requests/swr/_common"

export interface Page<item> {
  Items: item[]
  LastEvaluatedKey: { [key: string]: any }
}
/**
 * @param initialConfig common config for useSwrInfinite
 */
const setUseSwrInfinite = (initialConfig?: SWRInfiniteConfigInterface) => {
  return function useSwrInfinite<DataItem = unknown, Error = unknown>(
    apiConfig: apiConfig,
    configOverride?: SWRInfiniteConfigInterface & {
      showErrorMessage?: boolean
    },
  ) {
    const { showErrorMessage, ...config } = configOverride || {}
    const modifiedConfig: SWRInfiniteConfigInterface = {
      ...initialConfig,
      ...config,
    }
    const pages = useSWRInfinite<Page<DataItem>, Error>(
      (index, previousPageData) => {
        if (!apiConfig) return null
        if (index === 0) return JSON.stringify(setSwrKey(apiConfig))
        if (previousPageData?.LastEvaluatedKey) {
          return JSON.stringify({
            ...setSwrKey(apiConfig),
            lastEvaluatedKey: previousPageData.LastEvaluatedKey,
          })
        }

        return null
      },
      async (query) => {
        const { lastEvaluatedKey } = JSON.parse(query)
        const response = await API.get(apiConfig.apiName, apiConfig.path, {
          ...apiConfig.params,
          queryStringParameters: {
            ...apiConfig.params?.queryStringParameters,
            ...(Boolean(lastEvaluatedKey) &&
              encode({
                LastEvaluatedKey: lastEvaluatedKey,
              })),
          },
        })
        return response || { Items: [] }
      },
      modifiedConfig,
    )

    showErrorNotification(pages, showErrorMessage)

    const items = React.useMemo(() => {
      const items: DataItem[] = []
      if (!pages.data) return { items }

      for (const page of pages.data) items.push(...page.Items)
      return { items }
    }, [pages.data, pages.isValidating])

    const additionalProps = React.useMemo(() => {
      if (!pages.data || pages.error) {
        return { nextPage: undefined, loadMore: undefined } // we use "Object.assign" below, so we need to override previous values
      }
      const nextPage = pages.data[pages.data.length - 1]?.LastEvaluatedKey
        ? JSON.stringify(pages.data[pages.data.length - 1]?.LastEvaluatedKey)
        : undefined
      const loadMore = nextPage ? async () => pages.setSize(pages.size + 1) : undefined

      return { nextPage, loadMore }
    }, [pages.data, pages.error, pages.size])

    return Object.assign(pages, items, additionalProps)
  }
}

export interface useSwrInfinite<T> {
  Items: T[]
}
export const useSwrInfinite = setUseSwrInfinite(initialConfig)
