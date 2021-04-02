import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './utils/createStore'
import App from './App';
import './assets/css/bootstrap.min.css';
import './App.css';
import './assets/css/induc-course.css';
import './assets/css/dashboard.css';
import './assets/css/responsive.css';
import './assets/fonts/simple-line-icons.css';
import './assets/css/sf-icons-style.css';
import { register } from './serviceWorker';
import 'react-perfect-scrollbar/dist/css/styles.css';

export const Store = store;

if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("./firebase-messaging-sw.js")
		.then((registration) => {
			// console.log("Registration successful, scope is:", registration.scope);
			// debugger
		})
		.catch((err) => {
			// console.log("Service worker registration failed, error:", err);
		});
}

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root'),
	// register()
);
