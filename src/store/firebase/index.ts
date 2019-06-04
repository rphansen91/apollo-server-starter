import firebase from 'firebase-admin'

export const initFirebaseApp = (
  databaseURL: string,
  serviceAccount: firebase.ServiceAccount
) => {
  const credential = firebase.credential.cert(serviceAccount)
  return firebase.initializeApp({ credential, databaseURL })
}

export const verifyIdTokenGenerator = (auth: firebase.auth.Auth) => async (
  token: string
) => {
  if (!token) throw new Error('Token not supplied')
  // if (process.env.NODE_ENV === 'development') return 'DEVELOPMENT_USER'
  const decoded = await auth.verifyIdToken(token)
  return decoded.uid
}

export const createAuthStore = (auth: firebase.auth.Auth) => {
  return {
    verifyIdToken: verifyIdTokenGenerator(auth),
    getAccountByEmail: (email: string) => auth.getUserByEmail(email),
    getAccountById: (id: string) => auth.getUser(id),
  }
}

export const createFireStore = (db: firebase.firestore.Firestore) => {
  return {}
}

export type IFireStore = ReturnType<typeof createFireStore>
export type IAuthStore = ReturnType<typeof createAuthStore>
