const initialState = {
    teams: []
}

export default(state = initialState, action) => {
    switch(action.type){
        case 'FETCH_TEAMS' :
            return {
                teams: action.payload.teams
            }
        case 'ADD_TEAM' :
            return {
                ...state,
                teams: [...state.teams, action.payload.team]
            }
        case 'ADD_NEW_TEAMMATE':
        const teams2 = state.teams.slice()
        const indexTeam2 = teams2.map((elt) => elt._id).indexOf(action.payload.team._id)
        teams2[indexTeam2].users.push(action.payload.user)
            return {
                ...state,
                teams: teams2 
            }
        case 'REMOVE_TEAMMATE':
        const teams3 = state.teams.slice()
        const indexTeam3 = teams3.map((elt) => elt._id).indexOf(action.payload.team._id)
        teams3[indexTeam3] = action.payload.team
            return {
                ...state,
                teams: teams3 
            }
        case 'ADD_BOARD_TEAM' :
        const teams = state.teams.slice()
        const indexTeam = teams.map((elt) => elt._id).indexOf(action.payload.teamId)
        teams[indexTeam].boards.push(action.payload.board)
            return {
                ...state,
                teams: teams  
            }
        default: return state
    }
}