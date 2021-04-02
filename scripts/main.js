// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCHcibKMPMCmh9d4cHXuwO9fdlC5Fr9H-w",
    authDomain: "cpsc349project1todo.firebaseapp.com",
    projectId: "cpsc349project1todo",
    storageBucket: "cpsc349project1todo.appspot.com",
    messagingSenderId: "922401505847",
    appId: "1:922401505847:web:34d8abc94b02b5450775b2",
};

// Initialize Firebase
if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();
const auth = firebase.auth();