// Your web app's Firebase configuration
import firebase from 'firebase'
// import firestore from 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyAxNEAx_J0J4WufqW6_39ahJOxOpwBG4Lg",
  authDomain: "jcrm-932d2.firebaseapp.com",
  databaseURL: "https://jcrm-932d2.firebaseio.com",
  projectId: "jcrm-932d2",
  storageBucket: "jcrm-932d2.appspot.com",
  messagingSenderId: "112029546658",
  appId: "1:112029546658:web:87d22f99fffa4b45cbfffb"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore()
