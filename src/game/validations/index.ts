import orderBy from "lodash/orderBy"
import some from "lodash/some"

import { Game, GameState } from "../game"

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



export const validateGameState = (gameState: GameState) => {
}