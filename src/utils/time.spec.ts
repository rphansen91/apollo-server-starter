const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

describe('Time', () => {
  it('Should be check valid time difference', () => {
    const now = new Date().toISOString()
    const oneMinAgo = (new Date().valueOf() - MINUTE)
  })
})
