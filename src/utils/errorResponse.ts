export const errorResponse = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      errorMessage: message
    })
  }
}