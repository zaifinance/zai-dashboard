export const frozenOrLocked = (status: number) => {
  return status === 0 || status === 2
}
