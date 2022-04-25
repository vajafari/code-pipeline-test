import { dequal } from "dequal/lite"

/**
 * Deep difference between two objects
 *   - @todo Array & Object are updated as a whole for now
 *
 * @param  {object} oldObject previous state
 * @param  {object} newObject new state
 * @return new object containing only the difference
 */
export function getDifference(oldObject: any, newObject: any, result: any = {}) {
  for (const key of Object.keys(oldObject)) {
    const oldValue = oldObject[key]
    const newValue = newObject[key]

    switch (typeof newValue) {
      case "undefined":
        if (Array.isArray(oldValue)) {
          const removeOldValues: any = []
          result[key] = removeOldValues
          continue
        }

        if (typeof oldValue === "object") {
          result[key] = {}
          continue
        }

        result[key] = ""
        continue

      case "object":
        const isSame = dequal(oldValue, newValue)
        if (!isSame) {
          result[key] = newValue
        }
        continue

      default:
        if (newValue === "" && oldValue === undefined) continue

        if (newValue !== oldValue) {
          result[key] = newValue
          continue
        }
    }
  }

  for (const key of Object.keys(newObject)) {
    const oldValue = oldObject[key]
    const newValue = newObject[key]
    if (typeof oldValue === "undefined" && newValue !== "") {
      result[key] = newValue
      continue
    }
  }

  return result
}
