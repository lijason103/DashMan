import { socket } from './index';

const reducer = (
  state = {
	gameRooms: [],
  },
  action
) => {
  switch (action.type) {
	case 'GAME_ROOMS':
		state = { ...state, gameRooms: action.gameRooms}
		// socket && socket.emit('UPDATE_POT', state);
		break
    default:
      break;
  }

  return state;
};

export default reducer;