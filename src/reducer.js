const reducer = (
  state = {
	gameRooms: [],
	gameRoom: null,
	gameState: null,
  },
  action
) => {
  switch (action.type) {
	case 'GAME_ROOMS':
		state = { ...state, gameRooms: action.gameRooms }
		break
	case 'GAME_ROOM':
		state = { ...state, gameRoom: action.gameRoom }
		break
	case 'GAME_STATE':
		state = { ...state, gameState: action.gameState}
		break
    default:
      break;
  }

  return state;
};

export default reducer;