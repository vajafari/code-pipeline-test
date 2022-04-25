import { LambdaHandlerTypes } from "acp-types"
import { ObjectId } from "mongodb"

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any */
const decode = (obj: any): LambdaHandlerTypes.ParameterDecodeResult => {
  const resultObject: LambdaHandlerTypes.ParameterDecodeResult = {}
  if (obj && Object.prototype.toString.call(obj) == "[object Object]") {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const resultOfDecode = requestHelperExports.decodePrimitive(obj[key])
        if (resultOfDecode === false || resultOfDecode) {
          resultObject[key] = resultOfDecode
        }
      }
    }
  }
  return resultObject
}

const decodePrimitive = (
  val: string,
):
  | number
  | number[]
  | string
  | string[]
  | boolean
  | ObjectId
  | ObjectId[]
  | undefined => {
  const splittedString = val.split(";")
  if (splittedString.length > 1) {
    switch (splittedString[0]) {
      case LambdaHandlerTypes.QueryDataTypes.IntNumber:
        return Number.parseInt(splittedString[1])
      case LambdaHandlerTypes.QueryDataTypes.FloatNumber:
        return Number.parseFloat(splittedString[1])
      case LambdaHandlerTypes.QueryDataTypes.String:
        return splittedString[1]
      case LambdaHandlerTypes.QueryDataTypes.Boolean:
        return stringToBoolean(splittedString[1])
      case LambdaHandlerTypes.QueryDataTypes.Object:
      case LambdaHandlerTypes.QueryDataTypes.ArrayOfObject:
        return JSON.parse(splittedString[1])
      case LambdaHandlerTypes.QueryDataTypes.MongoObjectId:
        return new ObjectId(splittedString[1])
      case LambdaHandlerTypes.QueryDataTypes.ArrayOfIntNumber: {
        const arrayInt: number[] = []
        const arrayValues = splittedString[1].split(",")
        for (const element of arrayValues) {
          arrayInt.push(Number.parseInt(element))
        }
        return arrayInt
      }
      case LambdaHandlerTypes.QueryDataTypes.ArrayOfFloatNumber: {
        const arrayFloat: number[] = []
        const arrayValues = splittedString[1].split(",")
        for (const element of arrayValues) {
          arrayFloat.push(Number.parseFloat(element))
        }
        return arrayFloat
      }
      case LambdaHandlerTypes.QueryDataTypes.ArrayOfString: {
        const arrayString: string[] = []
        const arrayValues = splittedString[1].split(",")
        for (const element of arrayValues) {
          arrayString.push(element)
        }
        return arrayString
      }
      case LambdaHandlerTypes.QueryDataTypes.ArrayOfObjectId: {
        const arrayObjectId: ObjectId[] = []
        const arrayValues = splittedString[1].split(",")
        for (const element of arrayValues) {
          arrayObjectId.push(new ObjectId(element))
        }
        return arrayObjectId
      }
      default:
        return splittedString[1]
    }
  } else {
    return val
  }
}

const stringToBoolean = (value: string): boolean => {
  switch (value.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
      return true

    case "false":
    case "no":
    case "null":
    case "undefined":
    case "0":
    case null:
      return false
    default:
      return Boolean(value)
  }
}

export const requestHelperExports = {
  decodePrimitive,
  decode,
}
