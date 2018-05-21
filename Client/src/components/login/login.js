import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import LoginForm from './loginForm/loginForm'
import { bindActionCreators } from 'redux'
import GitHubLogin from 'react-github-login'
import axios from 'axios'
import setAuthorizationToken from '../../utils/setAuthorizationToken'
import jwt from 'jsonwebtoken'
import * as userActions from '../../actions/userActions'
import './login.css'
import AlertContainer from 'react-alert'




  class Login extends Component{

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            newUser: false,
            modalIsOpen: false,
            emailReset: '',
            test: 'tutu'
        }

    }

    logGitHub(response){
        axios.post(`http://localhost:3001/api/oauth_github`, {
            code: response.code
        })
        .then((res) => {
            const token = res.data.token
            localStorage.setItem('jwtToken', token)
            
            setAuthorizationToken(token)
            if (res.status === 201){
                this.setState({redirect: true, newUser: true, test: 'toto'})
            }
            else {
                localStorage.setItem('confirmed', true)
                this.setState({redirect: true, newUser: false})
                
            }

            this.props.actions.setCurrentUser(jwt.decode(token))
            
            
            
        })
        .catch((err)=>{
            console.log(err.response)
            this.showAlert(err.response.data.message)
        })
    }

    alertOptions = {
        offset: 90, // the offset of the alert from the page border, can be any number
        position: 'top left', // the position of the alert, can be [bottom left, bottom right, top left, top right]
        theme: 'light', // the color theme of the alert, can be [dark, light]
        time: 7000, // the time in miliseconds to the alert close itself, use 0 to prevent auto close (apply to all alerts)
        transition: 'scale'
    }

    showAlert = (msg) => {
            this.msg.error(msg, {
            type: 'error',
            })
        }
    
    render() {
        console.log(this.state.test)
        const onSuccess = response => {
            console.log('onsuccess')
            this.logGitHub(response)
        }
        const onFailure = response => {console.error(response);}

        if (this.state.redirect || localStorage.getItem('jwtToken')){
            if (this.state.newUser)
            return <Redirect to='/profile'/>
            else return <Redirect to='/'/>
        }
        return (
            <div className='contener-auth'>
            <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
            <LoginForm />
                <GitHubLogin 
                    clientId="83c7cab8ad3cfa2173f1"
                    redirectUri= {`http://localhost:3000/login`}
                    scope= "user"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    className="github-button"/>

            </div>
            
        )
    }
  
}

function mapStateToProps(state, props){
    return {
      user: state.auth,
    }
  }

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Login)
