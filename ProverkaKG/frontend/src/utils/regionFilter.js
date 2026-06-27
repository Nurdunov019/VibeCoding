export function regionApiParams(region) {
  return region && region !== 'all' ? { region } : {}
}
