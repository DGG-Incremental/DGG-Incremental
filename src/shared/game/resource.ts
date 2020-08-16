import * as R from 'ramda'
import { Game, Resource } from './types'





export const getResource = R.curry((key: Resource, game: Game) => R.defaultTo(0, R.prop(key, game.resources)))
export const setResource = R.curry((key: Resource, val: number, game: Game) => R.set(R.lensPath(['resources', key]), val, game) as Game)
export const addResource = R.curry((key: Resource, n: number, game: Game) => setResource(key, getResource(key, game) + n, game))
