// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZNtSZ3WpEwuF1wkcQlji5KGb1Vtr9L5I",
  authDomain: "simple-auth-f9362.firebaseapp.com",
  projectId: "simple-auth-f9362",
  storageBucket: "simple-auth-f9362.firebasestorage.app",
  messagingSenderId: "453715827154",
  appId: "1:453715827154:web:871e082ec1be502fdc100b",
  measurementId: "G-ZT7Y2V2RCL"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);