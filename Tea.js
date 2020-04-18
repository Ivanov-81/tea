import React from 'react'
import {Router, Switch, Route} from "react-router-dom"
import {createBrowserHistory} from "history"

import Main from "./containers/Main/Main"
import Admin from "./containers/Admin/Admin"
import PageNotFound from './errors/PageNotFound'
import Notifier from "./js/Notifier";

const history = createBrowserHistory();

export default function Tea() {

    return (

        <Router history={history}>

            <Notifier />

            <Switch>

                <Route exact path="/">
                    <Main/>
                </Route>

                <Route path="/admin_panel">
                    <Admin/>
                </Route>

                <Route path="*">
                    <PageNotFound/>
                </Route>

            </Switch>

        </Router>
    );
}