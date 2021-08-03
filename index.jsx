import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createStore} from 'redux'
import allReducers from "./redusers";
import {SnackbarProvider} from 'notistack';
// import { composeWithDevTools } from 'redux-devtools-extension';

import Tea from './Tea';

import {addDevice, addEvent} from "./actions/actionCreator";

// css
import './styles.css';
import './scrollbar.css'
import models from "./js/models";

let store;

if(window.location.hostname === "localhost") {
    store = createStore(allReducers,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );
}
else {
    store = createStore(allReducers);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw_tea.js',{scope: '/'})
            .then(registration => {
                console.log('SW registered!!!');
                // registration.pushManager.subscribe({userVisibleOnly: true});
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            })
    });
} else {
    console.log('Текущий браузер не поддерживает service worker-ы.');
}

window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    store.dispatch(addEvent(e));
});

models.connectDB();

store.dispatch(addDevice(models.getDevice()))

window.onbeforeunload = function (evt) {}

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            hideIconVariant={false}
            preventDuplicate
        >
        <Tea/>
        </SnackbarProvider>
    </Provider>,
    document.getElementById('tea')
);
