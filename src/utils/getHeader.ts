import get from 'lodash/get'

export const getHeader = (event: any, name: string): string => {
  return (
    get(event, `req.headers.${name}`) ||
    get(event, `req.headers.${name.toLowerCase()}`) ||
    get(event, `event.headers.${name}`) ||
    get(event, `event.headers.${name.toLowerCase()}`) ||
    ''
  )
}
