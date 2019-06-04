const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const product = (a: number) => (b: number) => a * b
export const seconds = product(SECOND)
export const minutes = product(MINUTE)
export const hours = product(HOUR)
export const days = product(DAY)
export const toIsoDate = (str?: string) => {
  if (!str) return new Date().toISOString()
  const date = new Date(str)
  if (date.valueOf()) date.toISOString()
  return ''
}
