import React, { Component } from 'react'
import './teamProfile.css'


class TeamProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentWillMount(){
    }

    

    render(){
        const item = this.props.item

        return (
        
        <div key={item._id} className="team-contener">
            <span className="title-team">Name : <strong>{item.name}</strong></span>
            <span className="title-team" >Description : {item.description}</span>

        </div> 
        )
    }      
}
export default TeamProfile