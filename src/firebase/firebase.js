import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyBgTCT6JemZzSkEfoHF1_jaRDdQMVKLiZo",
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: "https://fantasy-f1-34814.firebaseio.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  const auth = firebase.auth();
  const db = firebase.database();

export {
  auth,
  db,
};