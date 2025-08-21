// Firebase 初始化（Modular API
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const config = {
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  //   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // // measurementId: import.meta.env.VITE_FIREBASE_GA4,
  //   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
}

// 初始化 Firebase App
const app = initializeApp(config)

// 初始化 Firestore
export const db = getFirestore(app)
