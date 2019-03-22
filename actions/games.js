export const updateGames = games => {
  return {
    type: 'UPDATE_GAMES',
    payload: games,
  }
}

export const updateGameDetails = game => {
  return {
    type: 'UPDATE_GAME_DETAILS',
    payload: game,
  }
}

export const lastGameSelected = game => {
  return {
    type: 'LAST_GAME',
    payload: game,
  }
}
