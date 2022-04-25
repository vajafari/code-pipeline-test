import { AxiosError } from "axios"

export type ErrorType = AxiosError | Error | string

export const getAxiosMessageToDisplay = (
  error: ErrorType,
  defaultMessage = `An unhandled error happened, please try again later`,
): string => {
  let errorMessage = ``
  if (error) {
    if (typeof error === `object`) {
      const { response, message } = error as AxiosError
      if (response && response.data && response.data.errorMessage) {
        errorMessage = response.data.errorMessage
      } else if (message) errorMessage = message
    } else errorMessage = error
  }

  if (errorMessage) return errorMessage
  return defaultMessage
}
