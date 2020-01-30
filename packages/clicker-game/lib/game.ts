import merge from "lodash/merge"
import cloneDeep from "lodash/cloneDeep"
import { Action, ActionType, MakeSpearAction, reduceState } from "./actions"
import { exceedsRateLimit } from "./validations"

export interface GameState {
  scrap: number
  food: number
  hunger: number
  spears: number
  actions: Action[]
  lastSynced: Date
}

export default class Game {
  state: GameState = {
    spears: 0,
    scrap: 0,
    hunger: 1,
    food: 0,
    actions: [],
    lastSynced: new Date(0)
  }

  constructor(state: Partial<GameState> = {}) {
    merge(this.state, state)

    if (this.state.lastSynced) {
      this.state.lastSynced = new Date(this.state.lastSynced)
    }
  }

  pushAction(action: Action) {
    this.state.actions.push(action)
  }

  scavenge(timestamp: Date) {
    this.pushAction({ action: ActionType.scavenge, timestamp })
  }

  eat(timestamp: Date) {
    this.pushAction({ action: ActionType.eat, timestamp })
  }

  hunt(timestamp: Date) {
    this.pushAction({ action: ActionType.hunt, timestamp })
  }

  makeSpear(count: number, timestamp: Date) {
    const action: MakeSpearAction = {
      action: ActionType.makeSpear,
      timestamp,
      count
    }
    this.pushAction(action)
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
    return reduceState(cloneDeep(this.state), currentActions)
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


