import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter } from 'react-router-dom'
import setAuthorizationToken from '../../utils/setAuthorizationToken'
import * as userActions from '../../actions/userActions'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import "./header.css"



class UserHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            popShow: false,
            user: {}
        }
        this.logout = this.logout.bind(this)
    }

    logout() {
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('confirmed')
        
        setAuthorizationToken(false)
        this.props.actions.setCurrentUser({})
    }

    componentWillMount(){
        const headers = {
            headers: {'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`}
        }
        const user_id = jwt.decode(localStorage.getItem('jwtToken')).user_id
        axios.get(`${process.env.REACT_APP_API_URL}/profile/${user_id}`, headers)
        .then((response)=>{
            this.setState({user: response.data})
        })
    }


    render() {
        let popupclass
        if (this.state.popShow){
            popupclass="pop-over is-shown"
        }else{
            popupclass="pop-over"
        }

        if(!localStorage.getItem('jwtToken')){
            return <Redirect to='/login'/>
        }

        const {firstname,lastname, username, avatar} = this.state.user
        return (
                <div className="header-user">
                    <span className="header-btn" onClick={() => this.setState({ popShow: !this.state.popShow })}>
                    {!avatar && (
                    <div className='header-avatar'></div>
                    )}
                    {avatar && (
                    <div className='header-btn'>
                        <img className="user-avatar" alt="avatar" src={avatar}/>
                    </div>
                    )}
                    </span>
                    <div className={popupclass}>
                        <div className="pop-over-header">
                            <span className="pop-over-header-title">{username} ({firstname} {lastname})</span>
                        </div>
                        <div className="pop-over-content">
                            <ul className="pop-over-list">
                                <li>
                                    <span className="pop-over-btn" onClick={() => { this.props.history.push(`/profile`)
                                                                                    this.setState({ popShow: !this.state.popShow })}}><i className="zmdi zmdi-account"></i>Profile</span>
                                </li>
                            </ul>
                            <hr/>
                            <ul className="pop-over-list">
                                <li>
                                    <span className="pop-over-btn" onClick={this.logout}><i className="zmdi zmdi-key"></i>Log Out</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
        )
    }
}
function mapStateToProps(state, props){
    return {
      user: state.auth.user,
    }
  }

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
    }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(UserHeader))