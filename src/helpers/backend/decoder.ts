import { QueryDataTypes } from "./types"

interface ParameterDecodeResult {
  [name: string]: any
}

export const decode = (obj: any): ParameterDecodeResult => {
  const resultObject: ParameterDecodeResult = {}
  if (obj && Object.prototype.toString.call(obj) == "[object Object]") {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const resultOfDecode = decodePrimitive(obj[key])
        if (resultOfDecode === false || resultOfDecode) {
          resultObject[key] = resultOfDecode
        }
      }
    }
  }
  return resultObject
}

export const decodePrimitive = (val: string): number | number[] | string | string[] | boolean | undefined => {
  const splittedString = val.split(";")
  if (splittedString.length > 1) {
    switch (splittedString[0]) {
      case QueryDataTypes.IntNumber:
        return Number.parseInt(splittedString[1])
      case QueryDataTypes.FloatNumber:
        return Number.parseFloat(splittedString[1])
      case QueryDataTypes.String:
        return splittedString[1]
      case QueryDataTypes.Boolean:
        return stringToBoolean(splittedString[1])
      case QueryDataTypes.Object:
      case QueryDataTypes.ArrayOfObject:
        return JSON.parse(splittedString[1])
      case QueryDataTypes.MongoObjectId:
        return splittedString[1]
      case QueryDataTypes.ArrayOfIntNumber: {
        const arrayInt: number[] = []
        const arrayValues = splittedString[1].split(",")
        for (const element of arrayValues) {
          arrayInt.push(Number.parseInt(element))
        }
        return arrayInt
      }
      case QueryDataTypes.ArrayOfFloatNumber: {
        const arrayFloat: number[] = []
        const arrayValues = splittedString[1].split(",")
        for (const element of arrayValues) {
          arrayFloat.push(Number.parseFloat(element))
        }
        return arrayFloat
      }
      case QueryDataTypes.ArrayOfString: {
        const arrayString: string[] = []
        const arrayValues = splittedString[1].split(",")
        for (const element of arrayValues) {
          arrayString.push(element)
        }
        return arrayString
      }
      case QueryDataTypes.ArrayOfObjectId: {
        const arrayObjectId = []
        const arrayValues = splittedString[1].split(",")
        for (const element of arrayValues) {
          arrayObjectId.push(element)
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
      return true
    case "false":
    case "undefined":
    case "null":
      return false
    default:
      return Boolean(value)
  }
}
