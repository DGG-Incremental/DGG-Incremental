import { exceedsRateLimit } from "./validations"
import defaults from "lodash/defaults"


export enum ActionType {
  addGenerator = "addGenerator",
  clickPepe = "clickPepe",
  clickYee = "clickYee"
}

export interface Action {
  action: ActionType
  timestamp: Date
}

export interface GameState {
  pepes: number
  yees: number
  generators: number
  actions: Action[]
  lastSynced: Date
}

export default class Game {
  state: GameState

  constructor(state: Partial<GameState> = {}) {
    this.state = defaults({}, state, {
      pepes: 0,
      yees: 0,
      generators: 0,
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

  clickPepe(timestamp?: Date) {
    this.pushAction(ActionType.clickPepe, timestamp)
  }

  clickYee(timestamp?: Date) {
    this.pushAction(ActionType.clickYee, timestamp)
  }

  addGenerator(timestamp?: Date) {
    this.pushAction(ActionType.addGenerator, timestamp)
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

    const pepeClicks = currentActions.filter(a => a.action === "clickPepe")
      .length
    const yeeClicks = currentActions.filter(a => a.action === "clickYee").length

    const pepeScore = this.state.pepes + pepeClicks
    const yeeScore = this.state.yees + yeeClicks

    return {
      actions: [],
      generators: 0,
      pepes: pepeScore,
      yees: yeeScore,
      lastSynced: timestamp
    }
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

