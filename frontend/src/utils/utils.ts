export function convertToSnakeCase(string: string): string {
  return string.replace(/ /g, '_');
}

export function convertSnakeCaseToNormal(string: string): string {
  return string.replace(/_/g, ' ');
}

export function getTypeUserColor(type: string): string {
  switch (type) {
    case 'admin':
      return 'blue';
    case 'cadista':
      return 'red';
    default:
      return 'green';
  }
}

export function capitalizeFirstLetter(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
