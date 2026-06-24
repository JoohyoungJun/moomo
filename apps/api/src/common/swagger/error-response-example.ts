export function errorResponseExample(err: { message: string; code: string }) {
  return {
    code: err.code,
    message: err.message,
  };
}
