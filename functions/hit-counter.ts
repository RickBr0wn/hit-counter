import { ENV } from './config'
import { APIGatewayEvent } from 'aws-lambda'
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, increment, updateDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
  measurementId: ENV.FIREBASE_MEASUREMENT_ID,
}

initializeApp(firebaseConfig)
const db = getFirestore()

export async function handler(event: APIGatewayEvent) {
  const { path } = event

  if (!path || path === '/') {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'ERROR: A path must be supplied.' }),
    }
  }

  const param = path.replace('/', '')

  const docRef = doc(db, ENV.COLLECTION_NAME, param)

  await updateDoc(docRef, {
    hits: increment(1),
  })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ msg: `HIT-COUNTER: ${param} +1` }),
  }
}
