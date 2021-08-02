import React, { useEffect, Suspense, lazy } from 'react'
import { Router, Switch, Route } from "react-router-dom"
import { createBrowserHistory } from "history"

import Main from "./containers/Main/Main.js"
import PageNotFound from './errors/PageNotFound.js'
import Notifier from "./js/Notifier.js";
import { useDispatch, useSelector } from "react-redux";
import { updateApp } from "./actions/actionCreator.js";

const Admin = lazy(() => import('./containers/Admin/Admin'));

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

    useEffect(() => {
        let LS = localStorage.getItem('favorite')
        if(!LS) localStorage.setItem('favorite', '{}')
    },[])

    return (

            <Router history={history}>

                <Notifier />
                <Suspense fallback={<div>Загрузка...</div>}>
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
                </Suspense>
            </Router>

    );
}
