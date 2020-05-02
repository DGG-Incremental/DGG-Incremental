import { Game } from "clicker-game"
import PlayerGameState from "./db/entity/PlayerGameState"
import Joi from "@hapi/joi"
import { Action } from "clicker-game/lib/actions"

const syncSchema = Joi.object({
  actions: Joi.array().items(
    Joi.object({
      action: Joi.string(),
      timestamp: Joi.date()
        .greater(Joi.ref("/lastSync"))
        .less(Joi.ref("/sentAt"))
    })
  ),
  version: Joi.number()
    .integer()
    .required()
    .equal(Joi.ref("$version")),
  lastSync: Joi.date().required(),
  sentAt: Joi.date()
    .greater(Joi.ref("/lastSync"))
    .required()
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
      lastSync,
      sentAt: syncTime,
      version
    },
    syncSchema,
    { context: { version: playerState.version } }
  )
  const game = new Game(playerState.gameState)
  game.state.actions = actions
  game.validate()
  const newState = game.getStateAt(syncTime)
  playerState.gameState = newState
  playerState.version = version

  return await playerState.save()
}
