import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import 'semantic-ui-css/semantic.min.css'
//import '../public/Semantic-UI-CSS-master/semantic.min.css'
import './index.css'
import store from './redux/reducers/index'
import App from './component/App'

/* import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './redux/reducers'
import reduxThunk from 'redux-thunk'
 */

/* const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose

const store = createStore(
    reducers,
    { auth: { authenticated: localStorage.getItem('token') } },
    composeEnhancers(applyMiddleware(reduxThunk))
)
 */

/* ReactDOM.render(
    <Provider
        store={store}>
        <App />
    </Provider>
    , document.querySelector('#root')) */

/* if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
} */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider
    store={store}>
    <App />
</Provider>);