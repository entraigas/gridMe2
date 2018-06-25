import { createSelector } from 'reselect'

// selector
const getPlayers = (store) => store.players;

// reselect function
export const makePlayersGetter = () => createSelector(
  [ getPlayers ],
  (selector) => selector
)