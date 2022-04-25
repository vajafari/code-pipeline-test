export const pascalCaseToSneakCase = (str: string): string => {
  return str
    .replace(/\.?([A-Z])/g, function (x, y) {
      return `_` + y.toLowerCase()
    })
    .replace(/^_/, ``)
}
