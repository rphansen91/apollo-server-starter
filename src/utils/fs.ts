import path from 'path'
import fs from 'fs'

export const getSubDirectoryFiles = (dirname: string, filename: string) => {
  return fs.readdirSync(dirname)
  .map(dir => path.resolve(dirname, dir, filename))
  .filter(path => fs.existsSync(path))
}
