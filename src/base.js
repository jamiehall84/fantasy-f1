import firebase from "firebase";

const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_KEY,
  apiKey: "AIzaSyBgTCT6JemZzSkEfoHF1_jaRDdQMVKLiZo",
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID
});
export default app;