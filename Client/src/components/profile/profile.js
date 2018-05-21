import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as userActions from '../../actions/userActions'
import TextFieldGroup from '../TextFieldGroup'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import './profile.css'
import TeamProfile from './teamProfile'
import AlertContainer from 'react-alert'




  class Profile extends Component{

    constructor(props){
        super(props)
        this.state = {
            user: {},
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            oldPassword:'',
            newPassword:'',
            newPasswordConfirm:'',
            creationDate:'',
            lastConnection:'',
            teams:[],
            ok:false
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmitPassword = this.onSubmitPassword.bind(this)
        

    }

    componentWillMount(){
        if(!localStorage.getItem('jwtToken')) return <Redirect to='/login'/>
        const headers = {
            headers: {'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`}
        }
        const user_id = jwt.decode(localStorage.getItem('jwtToken')).user_id
        axios.get(`${process.env.REACT_APP_API_URL}/profile/${user_id}`, headers)
        .then((response)=>{
            
            this.setState({ user: response.data,
                            avatar: response.data.avatar,
                            firstname: response.data.firstname,
                            lastname: response.data.lastname,
                            username: response.data.username,
                            email: response.data.email,
                            creationDate: response.data.creationDate,
                            lastConnection: response.data.lastConnection,
                            teams:response.data.teams,
                            openPassword: false,
                            
                            })
        })
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit(event) {
        event.preventDefault() 
        const re = /\S+@\S+\.\S+/;
        

        if(this.state.firstname === '' || this.state.lastname === '' || this.state.email === '' ){
            this.showAlert("All fields are required ! ")
        }
        else if  (!re.test(this.state.email))
        this.showAlert("Please enter a valid email ")   
            
        else {
            const headers = {
                headers: {'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`}
            }
            axios.put(`${process.env.REACT_APP_API_URL}/users/${this.state.user._id}`, {
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                email: this.state.email,
            }, headers)
            .then((response) =>{
                console.log(response)
                if (response.status === 200 )
                localStorage.setItem('confirmed', true)
                    this.setState({
                        ok:true,
                        newPassword:'',
                        newPasswordConfirm:'',
                    })
            })
        }
    }

    onSubmitPassword(event) {
        event.preventDefault() 
        const headers = {
            headers: {'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`}
        }
        axios.put(`${process.env.REACT_APP_API_URL}/users/${this.state.user._id}/change-password`, {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword
        }, headers)
        .then(() => {
            this.setState({openPassword: false})
        })
        .catch((err)=>{
            console.log(err)
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

        let userTeams
        userTeams = this.state.teams.map((item, idx) => {
            return <TeamProfile key={item.id} item={item} />
        })

        var dateFormat = require('dateformat');
        if (!localStorage.getItem('jwtToken')){
            return <Redirect to='/login'/>
        }       

        /* else if (this.state.ok)
            return <Redirect to='/profile'/> */
        const {firstname, lastname, username, email, creationDate, lastConnection, avatar, oldPassword, newPassword, newPasswordConfirm} = this.state
        const passre = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
            
        return (
            
            <div className='profile-contener'>
            
                <div className="profile-header">
                    <div className="profile-header-content">
                        {(
                        <div className="user-details">
                        {avatar && (
                        <div className='profile-avatar'>
                            <img className="profile-image" alt="avatar" src={avatar}/>
                        </div>
                        )}
                            
                            
                        
                        <div className="user-name">
                            <div className="user-fullname">{username}</div>
                            
                            
                        </div>
                        <div className="creation-date">
                             <div className="title">Creation Date : </div> 
                             
                             <div className="item"> {dateFormat(creationDate, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</div>
                        </div>
                        <div className="last-connection">
                             <div className="title">Last Connection :</div>
                             
                             <div className="item">{dateFormat(lastConnection, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</div>    
                        </div>                         
                        </div>
                        
                        )}
                        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
                        {localStorage.getItem('confirmed')&&(
                        <div className="containerForm containerForm-profile">

                        
                            <form onSubmit={this.onSubmit} className="auth-form profile-form">

                                <TextFieldGroup
                                    field="firstname"
                                    label="firstname"
                                    value={firstname}
                                    onChange={this.onChange}
                                    required

/>
                                <TextFieldGroup
                                    field="lastname"
                                    label="lastname"
                                    value={lastname}
                                    onChange={this.onChange}
                                    required
                                />
                                {/* <TextFieldGroup
                                    field="username"
                                    label="Username"
                                    value={username}
                                    onChange={this.onChange}
                                /> */}

                                <TextFieldGroup
                                    field="email"
                                    label="Email"
                                    value={email}
                                    onChange={this.onChange}
                                    required
                                />

                                <div className="form-group"><button onClick={this.onSubmit} type="button" className="btn btn-success">Save</button></div>
                                
                            </form>
                            <div className="change-password" onClick={()=>{this.setState({openPassword: true, openForm: false})}}><i className="zmdi zmdi-lock-open"></i>Change Password</div>
                            {this.state.openPassword && (
                                <div className="containerForm containerForm-profile">
                                    <form onSubmit={this.onSubmitPassword} className="auth-form profile-form">
                                        
                                        <TextFieldGroup
                                            field="oldPassword"
                                            label="Current password (let empty if you're changing the password for the frst time)"
                                            value={oldPassword}
                                            onChange={this.onChange}
                                            type="password"
                                        />
                                        
                                        
                        
                                        <TextFieldGroup
                                            field="newPassword"
                                            label="New Password"
                                            value={newPassword}
                                            onChange={this.onChange}
                                            type="password"
                                        />
                                         {this.state.newPassword !== this.state.newPasswordConfirm && this.state.newPasswordConfirm !== '' && (
                                            <div className="alert-password">
                                                The two new passwords are not the same
                                            </div>
                                        )}
                                        
                                        <TextFieldGroup
                                        field="newPasswordConfirm"
                                        label="Confirm the new password"
                                        value={newPasswordConfirm}
                                        onChange={this.onChange}
                                        type="password"
                                    />
        
                                        
                                     {!passre.test(this.state.newPassword) && (
                                            <div className="alert-password">
                                                Your password should have at least 8 characters, including at least 1 uppercase, 1 lowercase and  1 numeric characters
                                            </div>
                                        )}
                                    <div className="form-group">
                                        <div onClick={this.onSubmitPassword} 
                                            className="save-btn btn-form btn-profile" 
                                            disabled={(this.state.newPassword !== this.state.newPasswordConfirm || this.state.newPassword === '' || this.state.newPasswordConfirm === '')}>
                                            SAVE
                                        </div>
                                        <div className="save-btn btn-form btn-profile cancel-profile"
                                            onClick={()=>{this.setState({openPassword: false})}}>
                                            CANCEL
                                        </div>
                                    </div>
                                        
                                    </form>
                                </div>
                            )}
                            
                            
                            </div>)}

                            {!localStorage.getItem('confirmed')&&(
                        <div className="containerForm containerForm-profile">

                        
                            <form onSubmit={this.onSubmit} className="auth-form profile-form">

                                <TextFieldGroup
                                    field="firstname"
                                    label="firstname"
                                    value={firstname}
                                    onChange={this.onChange}
                                    required

/>
                                <TextFieldGroup
                                    field="lastname"
                                    label="lastname"
                                    value={lastname}
                                    onChange={this.onChange}
                                    required
                                />
                                {/* <TextFieldGroup
                                    field="username"
                                    label="Username"
                                    value={username}
                                    onChange={this.onChange}
                                /> */}

                                <TextFieldGroup
                                    field="email"
                                    label="Email"
                                    value={email}
                                    onChange={this.onChange}
                                    required
                                />


                                <div className="form-group"><button onClick={this.onSubmit} type="button" className="btn btn-success">Save</button></div>
                                
                            </form>
                            
                            
                            
                            </div>)}
                    </div>
                </div>

                    <div className="teams-content">
                        <h2><i className="zmdi zmdi-accounts"></i>My teams</h2>
                        {userTeams}
                    </div>
                

            </div>
        )
        
    }
  
}
function mapStateToProps(state, props){
    return{
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
