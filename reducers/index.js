import { combineReducers } from 'redux';

const INITIAL_STATE = {
  games: {},
  gameList: [],
  lastGame: null,
};

const gameReducer = (state = INITIAL_STATE, action) => {
  console.log('reduce');

  switch (action.type) {
    case 'UPDATE_GAMES':
      const gameList = JSON.parse(action.payload);
      gameList.forEach(game => state.games[game.id] = game);

      return {
        ...state,
        gameList,
      };
    case 'UPDATE_GAME_DETAILS':
      const gameDetails = JSON.parse(action.payload);
      state.games[gameDetails.id] = gameDetails;

      return { ...state, games: state.games};
    case 'LAST_GAME':
      return { ...state, lastGame: JSON.parse(action.payload) };
    default:
      return state
  }
};

export default combineReducers({
  games: gameReducer,
});
