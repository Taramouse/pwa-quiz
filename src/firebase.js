import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyB5mvM8Q5Z_GCbuFI2zhebnh1S_tgrrbOA',
  authDomain: 'quiz-61c37.firebaseapp.com',
  databaseURL: 'https://quiz-61c37.firebaseio.com',
  projectId: 'quiz-61c37',
  storageBucket: 'quiz-61c37.appspot.com',
  messagingSenderId: '410100549987'
})

export default firebase
