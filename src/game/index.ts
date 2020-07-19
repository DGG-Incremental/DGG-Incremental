import * as Game from './game'

import * as Resource from './resource'

export type { Game } from './game'
export { createGame } from './game'


export const setResource = Resource.setResource<Resource.Resource, Game.Game>


