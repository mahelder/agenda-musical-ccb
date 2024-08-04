import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBMqOFWdcBLMFiWCcyOtW9jHy5D1JhbQII",
  authDomain: "agenda-ccb-franca.firebaseapp.com",
  databaseURL: "https://agenda-ccb-franca.firebaseio.com",
  projectId: "agenda-ccb-franca",
  storageBucket: "agenda-ccb-franca.appspot.com",
  messagingSenderId: "499264769516",
  appId: "1:499264769516:web:cad7e712aa6a9f4e4304c9",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
