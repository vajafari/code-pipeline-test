/**
 * Deep cloning for objects
 */
export const deepClone = (data: any) => JSON.parse(JSON.stringify(data))
