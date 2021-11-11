// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiqd7te_kRSPA2bEeDCOFLnbHi2bFbtrY",
  authDomain: "reservali-621c3.firebaseapp.com",
  projectId: "reservali-621c3",
  storageBucket: "reservali-621c3.appspot.com",
  messagingSenderId: "395516980520",
  appId: "1:395516980520:web:2098bc473055b7ee7f341d",
  measurementId: "G-6Z70PN05CT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}

// // Initialize Firebase or get the available instance (hot reload stuff)
// export default !firebase.apps.length
//   ? firebase.initializeApp(firebaseConfig)
//   : firebase.app();
