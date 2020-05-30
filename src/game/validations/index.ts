import orderBy from "lodash/orderBy"
import Joi from '@hapi/joi'
import some from "lodash/some"

import { Game, GameState } from "../game"
import { ActionType } from "../actions"
import { locations } from "../locations"

export const exceedsRateLimit = (game: Game, rateLimit = 15000) => {
  const timeline = orderBy(game.state.actions, ["timestamp"])
  return some(timeline, (action, i, actions) => {
    const start = action.timestamp
    const end = new Date(start.getTime() + 1000)
    let k: number
    for (k = i + 1; k < actions.length; k++) {
      if (actions[k].timestamp.getTime() > end.getTime()) {
        return rateLimit <= k - i - 1
      }
    }
    return rateLimit <= k - i - 1
  })
}


const ActionSchema = Joi.object().keys({
  action: Joi.string().valid(...Object.values(ActionType)),
  timestamp: Joi.date()
    // .when('#timestampLowerLimit', { is: Joi.exist(), then: Joi.date().greater('#timestampLowerLimit') })
    // .when('#timestampUpperLimit', { is: Joi.exist(), then: Joi.date().less('#timestampUpperLimit') })
})

const GoToLocationSchema = ActionSchema.keys({
  location: Joi.object().valid(...Object.values(locations))
})

const GameStateSchema = Joi.object({
  actions: Joi.array().items(ActionSchema),
  lastSynced: Joi.date(),
})

export const ConditionalActionSchema = Joi
  .alternatives()
  .conditional('.action', {
    switch: [
      { is: ActionType.goToLocation, then: GoToLocationSchema },
    ],
    otherwise: ActionSchema
  })

export const validateGameState = (gameState: GameState) => {
}