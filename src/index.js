import React from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';

import App from './App';
import './App.scss';

import store from './redux/store-test';



ReactDOM.render(
  <App store={store} />,
  document.getElementById('my-app')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();// reportWebVitals(console.log);

// window.addEventListener('unhandledrejection', event => {
//   let target = event.target;
//   let reason = event.reason;
//   let message = reason.message;
//   console.log('unhandledrejection target: ');
//   console.log(target);
//   console.log('unhandledrejection reason: ');
//   console.log(reason);
//   console.log('unhandledrejection message: ');
//   console.log(message);
// });