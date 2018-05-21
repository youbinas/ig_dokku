import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Redirect} from 'react-router'
import TextFieldGroup from '../../TextFieldGroup'
import axios from 'axios'
import setAuthorizationToken from '../../../utils/setAuthorizationToken'
import jwt from 'jsonwebtoken'
import * as userActions from '../../../actions/userActions'
import './loginForm.css'
import '../../ui-components/form-component.css'
import AlertContainer from 'react-alert'



  class LoginForm extends Component{
    constructor(props) {
        super(props)
        this.state = {
            login: '',
            password: '',
            errors: {},
            show: false,
            redirect: false
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    alertOptions = {
        offset: 90, // the offset of the alert from the page border, can be any number
        position: 'top left', // the position of the alert, can be [bottom left, bottom right, top left, top right]
        theme: 'light', // the color theme of the alert, can be [dark, light]
        time: 7000, // the time in miliseconds to the alert close itself, use 0 to prevent auto close (apply to all alerts)
        transition: 'scale'
    }
    
    showAlert = () => {
        this.msg.error('Wrong email or password', {
          type: 'error',
        })
    }


    handleKeyPress(event){
        if (event.charCode===13){
           this.onSubmit()
        }
    }

    onSubmit() {
        console.log(this.state)
        axios.post(`${process.env.REACT_APP_API_URL}/login`, {
            login: this.state.login,
            password: this.state.password
        })
        .then(
            (res) => {
                const token = res.data.token
                localStorage.setItem('jwtToken', token)
                setAuthorizationToken(token)
                this.props.actions.setCurrentUser(jwt.decode(token))
                this.setState({redirect: true})
            }
        )
        .catch((err)=>{
            console.log(err)
            this.showAlert()
        })
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        const { errors, login, password, redirect } = this.state
            if (redirect){
                return <Redirect to='/'/>
            }
            return (
                <div className="containerForm">
                    <h1> Sign in </h1>
                    <form onSubmit={this.onSubmit} className="auth-form">
                        
        
                        { errors.form && <div className="alert alert-danger">{errors.form}</div> }
                        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />

                        <TextFieldGroup
                            field="login"
                            label="Email or Username"
                            value={login}
                            error={errors.login}
                            onChange={this.onChange}
                            onKeyPress={this.handleKeyPress}
                            placeholder="email@domain.com"
                        />
        
                        <TextFieldGroup
                            field="password"
                            label="Password"
                            value={password}
                            error={errors.password}
                            onChange={this.onChange}
                            type="password"
                            onKeyPress={this.handleKeyPress}
                            placeholder=""
                        />
        
                        <div className="form-group"><div onClick={this.onSubmit} className="save-btn btn-form">Login</div></div>
                    </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)