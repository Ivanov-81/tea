import '@babel/polyfill';
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createStore} from 'redux'
import allReducers from "./redusers";
import {SnackbarProvider} from 'notistack';

import Tea from './Tea';
//
import {addEvent} from "./actions/actionCreator";

// css
import './styles.css';
import models from "./js/models";

// images
// import './favicon.ico'

// import models from "./js/models";

const store = createStore(allReducers,
    (window).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window).__REDUX_DEVTOOLS_EXTENSION__()
);

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