import React, { Component } from 'react'
import './App.css';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Store from './store'
import IndexPage from './pages/indexPage'
import LoginPage from './pages/loginPage'
import ProfilePage from './pages/profilePage'
import jwt from 'jsonwebtoken'
import setAuthorizationToken from './utils/setAuthorizationToken'
import { setCurrentUser } from './actions/userActions'
import Header from './../src/components/header/header'
//import requireAuth from './components/authenticate/authenticate'



const store = Store()

if (localStorage.jwtToken) {
    setAuthorizationToken(localStorage.jwtToken)
    store.dispatch(setCurrentUser(jwt.decode(localStorage.jwtToken)))
}


class App extends Component {


    render() {
        return (    
            <Router>
                 <Provider store = { store } >
                 <div>
                        <Route name="help" component={Header}/>
                        <Route exact path ='/'  component = {ProfilePage}/>
                        <Route exact path ='/login' component = {LoginPage}/>   
                        <Route exact path ='/profile' component = {ProfilePage}/>
                </div>
                </Provider>
            </Router>
        )
    }
}

export default DragDropContext(HTML5Backend)(App)