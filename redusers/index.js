import { combineReducers } from 'redux';

import Event from './event';
import App from './app';
import Snackbar from "./snackbar";
import Catalogs from "./catalogs";

const allReducers = combineReducers({
    app: App,
    event: Event,
    snackbar: Snackbar,
    catalogs: Catalogs,
});

export default allReducers;
