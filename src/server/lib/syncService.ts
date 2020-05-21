import { Game, locations, Action, ActionType } from "@shared/game"
import PlayerGameState from "./db/entity/PlayerGameState"
import Joi from "@hapi/joi"

const ActionSchema = Joi.object().keys({
  action: Joi.string().valid(...Object.values(ActionType)),
  timestamp: Joi.date()
    .when('#lastSync', { is: Joi.exist(), then: Joi.date().greater(Joi.ref('#lastSync')) })
    .when('#sentAt', { is: Joi.exist(), then: Joi.date().less(Joi.ref('#sentAt')) })
})
const GoToLocationSchema = ActionSchema.keys({
  location: Joi.object().valid(...Object.values(locations))
})

export const ConditionalActionSchema = Joi
  .alternatives()
  .conditional('.action', {
    switch: [
      { is: ActionType.goToLocation, then: GoToLocationSchema },
    ],
    otherwise: ActionSchema
  })

const syncSchema = Joi.object({
  actions: Joi.array().items(ConditionalActionSchema),
  version: Joi.number()
    .integer()
    .required()
    .equal(Joi.ref("$version")),
})

export const syncPlayerGameState = async (
  name: string,
  actions: Action[],
  syncTime: Date,
  version: number
) => {
  const playerState = await PlayerGameState.getOrCreate(name)
  const lastSync = process.env.NODE_ENV !== 'development' ? playerState.gameState.lastSynced : new Date(0)
  Joi.assert(
    {
      actions,
      version
    },
    syncSchema,
    {
      context: {
        lastSync,
        sentAt: syncTime,
        version: playerState.version
      }
    }
  )
  const game = new Game(playerState.gameState)
  game.state.actions = actions
  game.validate()
  const newState = game.getStateAt(syncTime)
  playerState.gameState = newState
  playerState.version = version

  return await playerState.save()
}
