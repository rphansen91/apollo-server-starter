declare module 'ipfs-http-client'

interface IPFS {
  get(hash: string): Promise<string>
}

interface IPFSOptions {
  host: string
  port: string
  protocol: string
}

declare module 'nodemailer'
declare module 'ethereum-input-data-decoder'
