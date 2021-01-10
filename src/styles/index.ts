export const breakpoints = {
  big: 1600,
  laptop: 1200,
  landscape: 1024,
  portrait: 768,
  mobile: 520,
}

export const mq: any = Object.keys(breakpoints).reduce((mq, bp) => {
  return {
    ...mq,
    [`${bp}`]: `@media only screen and (max-width: ${breakpoints[bp]}px)`,
  }
}, {})
