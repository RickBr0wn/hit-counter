import { APIGatewayEvent } from 'aws-lambda'
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, increment, updateDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
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

  const docRef = doc(db, process.env.COLLECTION_NAME, param)

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
