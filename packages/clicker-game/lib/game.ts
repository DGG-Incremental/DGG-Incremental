import merge from "lodash/merge"
import flow from "lodash/flow"
import filter from "lodash/filter"
import partial from "lodash/partial"
import partialRight from "lodash/partialRight"
import {
  Action,
  ActionType,
  MakeSpearAction,
  GoToLocation,
  applyAction,
  GenericAction
} from "./actions"
import { exceedsRateLimit } from "./validations"
import { getPassiveState } from "./passive"
import { GameLocation, locations } from "./locations"

import { Upgrade } from './upgrades'


export interface GenericGameState<D> {
  scrap: number
  food: number
  hunger: number
  spears: number
  currentLocation: GameLocation | null
  actions: GenericAction<D>[]
  lastSynced: Date
  upgrades: Upgrade[]
  unlockedLocations: GameLocation[]
  scavenge: number
}

export interface SerializedGameState extends GenericGameState<string> { }

export interface GameState extends GenericGameState<Date> { }

export class Game {
  state: GameState = {
    spears: 0,
    scrap: 0,
    hunger: 1,
    food: 0,
    scavenge: 0,

    // TODO: Fix cloneDeep mess here
    currentLocation: null,
    actions: [],
    lastSynced: new Date(0),
    upgrades: [{
      name: 'Soma',
      cost: [
        { resource: 'food', count: 1000 }
      ],
      description: 'test',
      owned: false,
    }],
    unlockedLocations: [locations.apartment, locations.factory, locations.groceryStore]
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
    if (location?.name === this.state.currentLocation?.name)
      return;
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
    const targetActions = filter(actions,
      (a: Action) =>
        a.timestamp.getTime() >= lastSynced.getTime() &&
        a.timestamp.getTime() <= timestamp.getTime()
    )
    const applied = targetActions.reduce(
      (state, action) => {
        const passiveState = getPassiveState(state, action.timestamp)
        return applyAction(action, passiveState)
      }, this.state
    )
    return getPassiveState(applied, timestamp)
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
