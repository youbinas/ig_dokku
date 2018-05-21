import axios from 'axios'

export function createEvent(event){
    return dispatch => {
        return axios.post('http://locahost:3001/api/events', event)
    }
}