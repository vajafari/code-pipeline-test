import _ from "lodash"
import { QueryDataTypes } from "./types"

export const getQueryObject = (input: any): QueryDataTypes | undefined => {
  switch (typeof input) {
    case `number`:
      if (Number.isInteger(input)) {
        return QueryDataTypes.IntNumber
      } else {
        return QueryDataTypes.FloatNumber
      }
    case `string`:
      if (input.length === 24 && /^[a-f0-9]*$/.test(input)) {
        return QueryDataTypes.MongoObjectId
      }
      return QueryDataTypes.String
    case `boolean`:
      return QueryDataTypes.Boolean
    case `object`:
      if (Array.isArray(input)) {
        if (input.length > 0) {
          const queryTypesOfElement = []
          for (const arrElement of input) {
            const res = getQueryObject(arrElement)
            if (res !== undefined) {
              queryTypesOfElement.push(res)
            }
          }
          if (queryTypesOfElement.length > 0) {
            const uniqueQueryTypesOfElement = _.uniq(queryTypesOfElement)
            if (uniqueQueryTypesOfElement.length === 1) {
              switch (uniqueQueryTypesOfElement[0]) {
                case QueryDataTypes.IntNumber:
                  return QueryDataTypes.ArrayOfIntNumber
                case QueryDataTypes.FloatNumber:
                  return QueryDataTypes.ArrayOfFloatNumber
                case QueryDataTypes.Object:
                  return QueryDataTypes.ArrayOfObject
                case QueryDataTypes.MongoObjectId:
                  return QueryDataTypes.ArrayOfObjectId
                default:
                  return QueryDataTypes.ArrayOfString
              }
            } else {
              return QueryDataTypes.ArrayOfString
            }
          }
        } else {
          return QueryDataTypes.ArrayOfString
        }
      } else {
        return QueryDataTypes.Object
      }
      break
  }
}

export const encode = (
  obj: any,
): {
  [name: string]: string
} => {
  let resultObject: {
    [name: string]: string
  } = {}
  if (obj && Object.prototype.toString.call(obj) == "[object Object]") {
    resultObject = {}
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const encodeResult = encodePrimitive(obj[key])
        if (encodeResult) {
          resultObject[key] = encodeResult
        }
      }
    }
  }
  return resultObject
}

export const encodePrimitive = (val: any): string | undefined => {
  let result = undefined
  const queryType = getQueryObject(val)
  switch (queryType) {
    case QueryDataTypes.IntNumber:
    case QueryDataTypes.FloatNumber:
    case QueryDataTypes.String:
    case QueryDataTypes.Boolean:
      result = `${queryType};${val}`
      break
    case QueryDataTypes.Object:
    case QueryDataTypes.ArrayOfObject:
      result = `${queryType};${JSON.stringify(val)}`
      break
    case QueryDataTypes.MongoObjectId:
      result = `${queryType};${val.toString()}`
      break
    case QueryDataTypes.ArrayOfIntNumber:
    case QueryDataTypes.ArrayOfFloatNumber:
    case QueryDataTypes.ArrayOfString:
      result = `${queryType};${val.join(",")}`
      break
    case QueryDataTypes.ArrayOfObjectId: {
      const arr = <string[]>val
      result = `${queryType};${arr.map((row) => row.toString()).join(",")}`
      break
    }
  }
  return result
}
