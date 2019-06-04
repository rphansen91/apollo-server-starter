import { randomBytes } from 'crypto'

const byteSize = 24

export const generate = () => {
  return new Promise<string>((res, rej) => {
    randomBytes(byteSize, (err: Error|null, buffer: Buffer) => {
      if (err) return rej(err)
      res(buffer.toString('hex'))
    })
  })
}
