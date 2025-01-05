import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { Persistence, ReactNativeAsyncStorage } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

declare module "firebase/auth" {
  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage
  ): Persistence;
}

const firebaseConfig = {
  apiKey: "AIzaSyDjITDKumUfF8pJbuIJkLA9wK7a2zx8x4s",
  authDomain: "chat-app-1dd84.firebaseapp.com",
  projectId: "chat-app-1dd84",
  storageBucket: "chat-app-1dd84.appspot.com",
  messagingSenderId: "79548047425",
  appId: "1:79548047425:web:bdd845de6274616cfb66c0",
  measurementId: "G-TJ13DYS85B",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDjITDKumUfF8pJbuIJkLA9wK7a2zx8x4s",
//   authDomain: "chat-app-1dd84.firebaseapp.com",
//   projectId: "chat-app-1dd84",
//   storageBucket: "chat-app-1dd84.appspot.com",
//   messagingSenderId: "79548047425",
//   appId: "1:79548047425:web:bdd845de6274616cfb66c0",
//   measurementId: "G-TJ13DYS85B",
// };

// const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);
