import * as firebase from "firebase/app";
import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAjQcfhQeD6595HfccTBcLlEC5Lex6aQnw",
    authDomain: "sf-test-mah.firebaseapp.com",
    databaseURL: "https://sf-test-mah.firebaseio.com",
    projectId: "sf-test-mah",
    storageBucket: "sf-test-mah.appspot.com",
    messagingSenderId: "279432599586",
    appId: "1:279432599586:web:b6273bdcdc4fc30595127b",
    measurementId: "G-5LQH85PC8T"
});

let messaging = null;
try {
    if (firebase.messaging.isSupported) {
        messaging = initializedFirebaseApp.messaging();
        messaging.usePublicVapidKey(
            "BFgt8frHghkhF0EXa4jiMJRefpIS5Nq2HJcSdGmjhD7vcgDfFX58g3EB3-ZwFSXFzOlVgkXCLByLVbhQfIVm7bk"
        );
    }
} catch (err) {

}

export { messaging };