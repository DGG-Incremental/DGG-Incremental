import { GameState } from "./game"
import CONFIG from "./config"
import flow from "lodash/flow"
import max from "lodash/max"

interface PassiveTransformer {
  (state: GameState, timestamp: Date): GameState
}

export const transformers: { [name: string]: PassiveTransformer } = {
  hunger(state, timestamp) {
    const time = timestamp.getTime() - state.lastSynced.getTime()
    const change = CONFIG.BASE_HUNGER_RATE * time
    const hunger = max([state.hunger + change, 0]) as number
    return { ...state, hunger }
  }
}

const transformFns = Object.values(transformers)
export const getPassiveState: (
  state: GameState,
  timestamp: Date
) => GameState = flow(transformFns)
