import React from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import FeedPage from './FeedPage'

function Router () {
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path = "/register-page">
                    <RegisterPage/>
                </Route>
                <Route exact path = "/login">
                    <LoginPage/>
                </Route>
                <Route exact path = "/feed">
                    <FeedPage/>
                </Route>
                {/* <Route exact path = "/post/:postId">
                    <Post/>
                </Route> */}
            </Switch>
        </BrowserRouter>
    )
}

export default Router 