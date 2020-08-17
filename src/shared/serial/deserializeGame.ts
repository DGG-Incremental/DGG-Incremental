import * as Joi from 'joi'
import * as Game from '../game'
import * as R from 'ramda'
import { GameSchema } from './GameSchema'

interface DeserializeGameResult {
    success: boolean
    error: Error | null
    game: Game.Game | null
}

export const deserializeGame = (s: string): DeserializeGameResult => {
    try {
        return R.pipe<string, any, any, any, DeserializeGameResult>(
            R.unary(JSON.parse),
            R.curry(Joi.attempt)(R.__, GameSchema),
            R.objOf('game'),
            R.merge({
                success: true,
                error: null
            })
        )(s)
    }
    catch (error) {
        return {
            success: false,
            error,
            game: null
        }
    }
}
