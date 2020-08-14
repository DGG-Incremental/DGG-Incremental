import * as Joi from 'joi'
import * as Game from '../game'
import * as R from 'ramda'

const GameSchema = Joi.object({
    actionQueue: Joi
        .array().items(Joi.object({
           type: Joi.string(),
           timestamp: Joi.date() 
        }))
        .required(),
    fabricators: Joi
        .array().items(Joi.object({
           blueprint: Joi.string(),
           endTime: Joi.date(),
           startTime: Joi.date()
        }))
        .required(),
    resources: Joi
        .object()
        .required()
})


interface DeserializeGameResult {
    success: boolean
    error: Error | null
    game: Game.Game | null
}

export const deserializeGame = (s: string): DeserializeGameResult => {
    try {
        return R.pipe(
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
