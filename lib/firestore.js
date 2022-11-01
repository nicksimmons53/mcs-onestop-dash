import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID,
//     measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
    apiKey: "AIzaSyAUNZ5p2NlHgXVO0lt6E-h8Mic7RiGxsH4",
    authDomain:'mc-surfaces-inc.firebaseapp.com',
    projectId: 'mc-surfaces-inc',
    storageBucket: 'mc-surfaces-inc.appspot.com',
    messagingSenderId: '795334715211',
    appId: '1:795334715211:web:84a333e74acd4cc496eace',
    measurementId: 'G-LVBMG15P3N',
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

export {
    app,
    db,
};