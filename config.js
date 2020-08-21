import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyAC9vJHX-8x7t1-Ff3S72Bji-aN9x0aJ7E",
  authDomain: "time-scheduler-51765.firebaseapp.com",
  databaseURL: "https://time-scheduler-51765.firebaseio.com",
  projectId: "time-scheduler-51765",
  storageBucket: "time-scheduler-51765.appspot.com",
  messagingSenderId: "867426330765",
  appId: "1:867426330765:web:ea721ed08f92dac13f5ac4"
};
  // Initialize Firebase
  
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();