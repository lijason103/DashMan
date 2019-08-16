const reducer = (
  state = {
	gameRooms: [],
	gameRoom: null,
  },
  action
) => {
  switch (action.type) {
	case 'GAME_ROOMS':
		state = { ...state, gameRooms: action.gameRooms }
		// socket && socket.emit('UPDATE_POT', state);
		break
	case 'GAME_ROOM':
		state = { ...state, gameRoom: action.gameRoom }
		break
    default:
      break;
  }

  return state;
};

export default reducer;