export function routeTitle(input: string) {
  return input
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}