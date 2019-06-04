import AWS from 'aws-sdk'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'

AWS.config.apiVersions = {
  ssm: '2014-11-06',
}

const ssm = new AWS.SSM()

export async function getSecrets(secrets: string[]) {
  const { Parameters } = await ssm
    .getParameters({
      Names: secrets,
      WithDecryption: true,
    })
    .promise()
  return mapValues(groupBy(Parameters, 'Name'), v => v[0].Value)
}
