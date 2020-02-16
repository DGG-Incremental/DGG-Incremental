import merge from "lodash/merge"
import flow from "lodash/flow"
import filter from "lodash/filter"
import cloneDeep from "lodash/cloneDeep"
import partial from "lodash/partial"
import partialRight from "lodash/partialRight"
import {
  Action,
  ActionType,
  MakeSpearAction,
  reduceState,
  GoToLocation
} from "./actions"
import { exceedsRateLimit } from "./validations"
import { getPassiveState } from "./passive"

export interface GameLocation {
  name: string
  info: string
  description: string
}

export interface GameState {
  scrap: number
  food: number
  hunger: number
  spears: number
  locations: GameLocation[]
  currentLocation: GameLocation | null
  actions: Action[]
  lastSynced: Date
}

const INIT_LOCATIONS: GameLocation[] = [
  {
    name: "Factory",
    info: "The Factory is a place",
    description:
      "The rusted carcases of old machines huddle around the concrete floor."
  },
  {
    name: "Apartment Complex",
    info: "",
    description: ""
  },
  {
    name: "Grocery Store",
    info: "",
    description: ""
  }
]

export class Game {
  state: GameState = {
    spears: 0,
    scrap: 0,
    hunger: 1,
    food: 0,
    locations: cloneDeep(INIT_LOCATIONS),
    // TODO: Fix cloneDeep mess here
    currentLocation: cloneDeep(INIT_LOCATIONS)[1],
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

  goToLocation(location: GameLocation | null, timestamp: Date) {
    const action: GoToLocation = {
      action: ActionType.goToLocation,
      location,
      timestamp
    }
    this.pushAction(action)
  }

  getCurrentState() {
    return this.getStateAt(new Date())
  }

  getStateAt(timestamp: Date): GameState {
    const { lastSynced, actions } = this.state

    return flow(
      filter(
        (a: Action) =>
          a.timestamp.getTime() >= lastSynced.getTime() &&
          a.timestamp.getTime() <= timestamp.getTime()
      ),
      partial(reduceState, this.state),
      partialRight(getPassiveState, timestamp)
    )(actions)
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
