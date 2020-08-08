import {Game} from './types'


export const createGame = () => {
  return {
    actionQueue: [],
    fabricators: [],
    resources: {
      metal: 0,
      wire: 0
    }
  } as Game
}