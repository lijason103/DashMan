import { 
	SET_GAME_ROOMS,
	SET_GAME_ROOM,
	SET_GAME_STATE,
	SET_GAME_OVER_STATE,
	SET_PLAYER_NAME,
} from './actions'

const reducer = (
    state = {
		gameRooms: [],
		gameRoom: null,
		gameState: null,
		gameOverState: null,
		playerName: 'unnamed'
    },
    action
	) => {
		switch (action.type) {
		case SET_GAME_ROOMS:
				state = { ...state, gameRooms: action.gameRooms }
				break
		case SET_GAME_ROOM:
				state = { ...state, gameRoom: action.gameRoom }
				break
		case SET_GAME_STATE:
				state = { ...state, gameState: action.gameState}
				break
		case SET_GAME_OVER_STATE:
				state = { ...state, gameOverState: action.gameOverState}
				break
		case SET_PLAYER_NAME:
			state = { ...state, playerName: action.playerName}
			break
		default:
			break;
		}
	
		return state;
	};
  
export default reducer;