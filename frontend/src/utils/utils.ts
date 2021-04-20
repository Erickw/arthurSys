export function convertToSnakeCase(string: string): string {
  return string.replace(/ /g, '_');
}

export function convertSnakeCaseToNormal(string: string): string {
  return string.replace(/_/g, ' ');
}
