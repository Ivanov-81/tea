import React, {useEffect} from 'react'
import {Router, Switch, Route} from "react-router-dom"
import {createBrowserHistory} from "history"

import Main from "./containers/Main/Main.js"
import Admin from "./containers/Admin/Admin.jsx"
import PageNotFound from './errors/PageNotFound.js'
import Notifier from "./js/Notifier.js";
import {useDispatch, useSelector} from "react-redux";
import {updateApp} from "./actions/actionCreator.js";

const history = createBrowserHistory();

export default function Tea() {

    const dispatch = useDispatch()

    const update = useSelector(store => store.app.update)

    useEffect(() => {

        if(update) {
            setTimeout(() => {
                dispatch(updateApp(false))
            }, 500)
        }

    }, [update])

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
