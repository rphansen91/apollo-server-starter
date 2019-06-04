export function getServerOptions() {
  return {
    port: Number(process.env.PORT || 8082),
    privateKeyPath: process.env.PRIVATE_KEY_PATH,
    mongo: {
      uri: process.env.MONGO_URI,
    },
    ipfs: {
      host: process.env.IPFS_HOST || 'localhost',
      port: process.env.IPFS_PORT || '5001',
      protocol: process.env.IPFS_PROTOCOL || 'http',
    },
    firebase: {
      serviceAccountPath: process.env.SERVICE_ACCOUNT || '',
      databaseUrl: process.env.DATABASE_URL || '',
    },
  }
}

export function getWeb3ProviderOptions() {
  return {
    ipc: process.env.IPC_ENDPOINT,
    http: process.env.WEB3_HTTP_ENDPOINT,
    socket: process.env.WEB3_WEBSOCKET_ENDPOINT,
  }
}

export function getContractOptions() {
  return {
    xyo: {
      abiHash: process.env.XYO_ABI_HASH || '',
      address: process.env.XYO_CONTRACT_ADDRESS || '',
    },
    multisender: {
      abiHash: process.env.COIN_MULTISENDER_ABI_HASH || '',
      address: process.env.COIN_MULTISENDER_ADDRESS || '',
    },
  }
}

export function getSsmKeyNames() {
  return {
    web3UriName: process.env.WEB3_KEY_NAME || '',
    privateKeyName: process.env.PRIVATE_KEY_NAME || '',
  }
}
