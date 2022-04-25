export interface injectCorsHeadersResult {
  ["Access-Control-Allow-Origin"]: "*"
  ["Access-Control-Allow-Credentials"]: true
}

const injectCorsHeaders = (entityName: string, method: string): injectCorsHeadersResult | undefined => {
  if (entityName === "address" && method.toUpperCase() === "GET".toUpperCase()) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    }
  }
  if (entityName === "address" && method.toUpperCase() === "POST".toUpperCase()) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    }
  }
  if (entityName === "address" && method.toUpperCase() === "PUT".toUpperCase()) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    }
  }
  if (entityName === "address" && method.toUpperCase() === "DELETE".toUpperCase()) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    }
  }
  if (entityName === "address" && method.toUpperCase() === "GET".toUpperCase()) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    }
  }
}

export const corsHeaderHelperExports = {
  injectCorsHeaders,
}
