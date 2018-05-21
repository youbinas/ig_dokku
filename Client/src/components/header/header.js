import React, { Component } from 'react'
import Store from '../../store'
import { Provider } from 'react-redux'
import UserHeader from './header-user'
import "./header.css"

const store = Store()


class Header extends Component {

    render() {
        return (
            <Provider store = { store } >
                <div className="navbar navbar-fixed-top header" id="header-app">
                    <div id="content-logo"><a href="/">Ig Dokku</a></div>
                    {localStorage.getItem('jwtToken') && (
                        <div>
                        <UserHeader/>
                        </div>
                    )}
                </div>
            </Provider>
        )
    }
}

export default Header