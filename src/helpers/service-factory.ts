import { API } from "@aws-amplify/api"
import { deepClone } from "acp/src/helpers/deep-clone"
import { getAxiosMessageToDisplay } from "acp/src/helpers/error-message-helper"
import { addNotification } from "acp/src/helpers/hooks/use-notification-store"
import { cleanObjKeys, setPropsAssign } from "acp/src/helpers/store-factory"
import { apiConfig, mutate, setSwrKey, useSwr, useSwrInfinite } from "acp/src/plugins"

interface ServiceMethodInput extends Pick<apiConfig, "apiName" | "path" | "params"> {
  successMessage?: string
  showErrorMessage?: boolean
}
interface MutationParam {
  mutationKeys?: apiConfig[]
  mutateDynamic?: useSwrInfinite<useSwrInfinite<any>>
  mutate?: (newData: any, shouldRevalidate: boolean) => void
  data?: { Items: any[]; LastEvaluatedKey: any }[]
  findIndex: (items?: any[]) => number | undefined
}
export interface DeleteInput extends ServiceMethodInput {
  mutations?: MutationParam
}

export interface CreateInput extends ServiceMethodInput {
  item: any
  readSwrParams?(updatedItem: any): apiConfig
}

export interface UpdateInput extends ServiceMethodInput {
  item: any
  method: "put" | "patch"
  readSwrParams?(updatedItem: any): apiConfig
  extraMutations?: MutationParam
}

interface apiRequest<Result> extends apiConfig, ServiceMethodInput {
  method: "post" | "put" | "del" | "patch" | "get"
  onSuccess?: (result: Result) => void | Promise<void>
  successValidation?: (result: Result) => boolean
}
export const apiRequest = async <Result>({
  showErrorMessage = true,
  successValidation = () => true,
  ...props
}: apiRequest<Result>): Promise<any> => {
  try {
    const result = await API[props.method](props.apiName, props.path, props.params)
    if (result && result.errorMessage) {
      throw new Error(result.errorMessage)
    } else if (successValidation(result)) {
      if (props.onSuccess) await props.onSuccess(result)

      if (props.successMessage) {
        addNotification({
          options: { variant: `success` },
          message: props.successMessage,
        })
      }

      return result
    }
  } catch (exp: any) {
    if (showErrorMessage)
      addNotification({
        options: { variant: `error` },
        message: getAxiosMessageToDisplay(exp),
      })
    throw exp
  }
}

export const Delete = async (props: DeleteInput): Promise<any> =>
  apiRequest({
    ...props,
    method: `del`,
    successValidation: (result: any) => Boolean(result) && !Boolean(result.errorMessage),
    onSuccess: async () => {
      if (props.mutations) {
        if (props.mutations.mutationKeys) {
          const mutationPromises = []
          for (const mutationKey of props.mutations.mutationKeys) {
            mutationPromises.push(
              mutate(JSON.stringify(setSwrKey(mutationKey)), (data: useSwrInfinite<any>) => {
                if (data) {
                  const idx = props.mutations?.findIndex(data?.Items)
                  if (idx !== undefined && idx > -1) data.Items.splice(idx, 1)
                }
              }),
            )
          }
          await Promise.all(mutationPromises)
        } else if (props.mutations.mutate && props.mutations.data) {
          const newState = props.mutations.data.map((el) => {
            const items = el.Items
            const idx = props.mutations?.findIndex(items)
            if (idx !== undefined && idx > -1) items.splice(idx, 1)
            return {
              Items: items,
              LastEvaluatedKey: el.LastEvaluatedKey,
            }
          })
          void props.mutations.mutate(newState, true)
        }
      }
    },
  })

export const Create = async (props: CreateInput): Promise<any> => {
  return apiRequest({
    ...props,
    method: `post`,
    params: { body: props.item },
    onSuccess: async (result) => {
      if (props.readSwrParams)
        await mutate(JSON.stringify(setSwrKey(props.readSwrParams(result))), (data: useSwr<any>) => {
          if (data) {
            cleanObjKeys(data)
            setPropsAssign(data, result as any)
          }
        })
    },
  })
}

export const Update = async (props: UpdateInput): Promise<any> => {
  if (props.item && Object.keys(props.item).length > 0) {
    return apiRequest({
      ...props,
      method: props.method,
      params: { body: props.item },
      onSuccess: async (result) => {
        if (props.readSwrParams)
          await mutate(JSON.stringify(setSwrKey(props.readSwrParams(result))), (data: useSwr<any>) => {
            if (data) {
              cleanObjKeys(data)
              setPropsAssign(data, result as any)
            }
          })
        if (props.extraMutations) {
          if (props.extraMutations.mutationKeys) {
            const mutationPromises = []
            for (const mutationKey of props.extraMutations.mutationKeys) {
              mutationPromises.push(
                mutate(JSON.stringify(setSwrKey(mutationKey)), (data: useSwrInfinite<any>) => {
                  if (data) {
                    const idx = props.extraMutations?.findIndex(data?.Items)
                    if (idx) {
                      const newItem = deepClone({
                        ...data.Items[idx],
                        ...props.item,
                      })
                      data.Items.splice(idx, 1, newItem)
                    }
                  }
                }),
              )
            }
            await Promise.all(mutationPromises)
          } else if (props.extraMutations.mutate && props.extraMutations.data) {
            const newState = props.extraMutations.data.map((el) => {
              const items = el.Items
              const idx = props.extraMutations?.findIndex(items)
              if (idx !== undefined && idx > -1) {
                const newItem = deepClone({
                  ...items[idx],
                  ...props.item,
                })
                items.splice(idx, 1, newItem)
              }
              return {
                Items: items,
                LastEvaluatedKey: el.LastEvaluatedKey,
              }
            })
            void props.extraMutations.mutate(newState, true)
          }
        }
      },
    })
  }
}

export const Get = async (props: ServiceMethodInput): Promise<any> => apiRequest({ ...props, method: `get` })
