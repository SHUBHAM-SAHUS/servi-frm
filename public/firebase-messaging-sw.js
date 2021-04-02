importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js");

firebase.initializeApp({
    // Project Settings => Add Firebase to your web app
    apiKey: "AIzaSyAjQcfhQeD6595HfccTBcLlEC5Lex6aQnw",
    authDomain: "sf-test-mah.firebaseapp.com",
    databaseURL: "https://sf-test-mah.firebaseio.com",
    projectId: "sf-test-mah",
    storageBucket: "sf-test-mah.appspot.com",
    messagingSenderId: "279432599586",
    appId: "1:279432599586:web:b6273bdcdc4fc30595127b",
    measurementId: "G-5LQH85PC8T"
});

try {
    if (firebase.messaging.isSupported) {
        const messaging = firebase.messaging();

        // messaging.setBackgroundMessageHandler(function (payload) {
        //     //   const promiseChain = clients
        //     //     .matchAll({
        //     //       type: "window",
        //     //       includeUncontrolled: true
        //     //     })
        //     //     .then(windowClients => {
        //     //       for (let i = 0; i < windowClients.length; i++) {
        //     //         const windowClient = windowClients[i];
        //     //         windowClient.postMessage(payload);
        //     //       }
        //     //     })
        //     //     .then(() => {
        //     //       return registration.showNotification("my notification title");
        //     //     });
        //     //   return promiseChain;
        //     const notification = JSON.parse(payload.data.notification);
        //     // Customize notification here
        //     const notificationTitle = 'Title';
        //     const notificationOptions = {
        //         body: 'Body',
        //         icon: 'Icon'
        //     };

        //     return self.registration.showNotification(notificationTitle,
        //         notificationOptions);
        // });

        // self.addEventListener('notificationclick', function (event) {
        //     // do what you want
        //     // ...
        // });

        messaging.setBackgroundMessageHandler(function (payload) {
            const promiseChain = clients
                .matchAll({
                    type: "window",
                    includeUncontrolled: true
                })
                .then(windowClients => {
                    for (let i = 0; i < windowClients.length; i++) {
                        const windowClient = windowClients[i];
                        windowClient.postMessage(payload);
                    }
                })
                .then(() => {
                    return registration.showNotification("my notification title");
                });
            return promiseChain;
        });
        self.addEventListener('notificationclick', function (event) {
            // do what you want
            // ...
        });
    }
} catch (err) {

}

