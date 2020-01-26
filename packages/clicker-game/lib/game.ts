import { exceedsRateLimit } from "./validations"
import defaults from "lodash/defaults"

export enum ActionType {
  scavenge = "scavenge"
}

export interface Action {
  action: ActionType
  timestamp: Date
}

export interface GameState {
  scrap: number
  food: number
  actions: Action[]
  lastSynced: Date
}

export default class Game {
  state: GameState

  constructor(state: Partial<GameState> = {}) {
    this.state = defaults({}, state, {
      scrap: 0,
      food: 0,
      actions: [],
      lastSynced: new Date(0)
    })

    if (this.state.lastSynced) {
      this.state.lastSynced = new Date(this.state.lastSynced)
    }
  }

  pushAction(type: ActionType, timestamp?: Date) {
    this.state.actions.push({
      action: type,
      timestamp: timestamp || new Date()
    })
  }

  scavenge(timestamp?: Date) {
    this.pushAction(ActionType.scavenge, timestamp)
  }

  getCurrentState() {
    return this.getStateAt(new Date())
  }

  getStateAt(timestamp: Date): GameState {
    const { lastSynced, actions } = this.state

    const currentActions = actions.filter(
      a =>
        a.timestamp.getTime() >= lastSynced.getTime() &&
        a.timestamp.getTime() <= timestamp.getTime()
    )

    return reduceState(this.state, currentActions)
  }

  validate() {
    if (exceedsRateLimit(this)) {
      throw "Too many actions"
    }
  }

  fastForward(game: Game) {
    // Return a game object that is passed game + actions in current game that
    // have a time stamp after passed game
    const actions = this.state.actions.filter(
      a => a.timestamp > game.state.lastSynced
    )
    return new Game({
      ...game.state,
      actions
    })
  }
}

interface ActionReducer {
  (state: GameState, action: ActionType): GameState
}

type ActionReducerMap = {
  [t in ActionType]: ActionReducer
}

const actionReducers: ActionReducerMap = {
  scavenge(state) {
    state.scrap = state.scrap + 1
    return state
  }
}

const reduceState = (state: GameState, actions: Action[]) => {
  return actions.reduce(
    (state, action) => actionReducers[action.action](state, action.action),
    state
  )
}
