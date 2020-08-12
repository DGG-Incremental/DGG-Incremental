import { prop, set, defaultTo, __, curry, lensPath, map } from 'ramda'
import { Game, Resource } from './types'




const gameResourceLens = (r: Resource) => lensPath<number, Game>(['resources', r])
export const getResource = curry((key: Resource, game: Game) => defaultTo(0, prop(key, game.resources)))
export const setResource = curry((key: Resource, val: number, game: Game) => set(gameResourceLens(key), val, game))
export const addResource = curry((key: Resource, n: number, game: Game) => setResource(key, getResource(key, game) + n, game))
