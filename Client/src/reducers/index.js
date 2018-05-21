import { combineReducers } from 'redux';
import auth from './auth'
import userTeams from './teams'


const reducers = combineReducers({
    auth,
    userTeams
});

export default reducers;