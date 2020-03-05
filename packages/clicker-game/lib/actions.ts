import { CondPair } from "lodash"
import produce from "immer"
import cond from "lodash/cond"
import min from "lodash/min"
import { GameState } from "./game"
import { GameLocation, locations } from "./locations"

export enum ActionType {
  scavenge = "scavenge",
  hunt = "hunt",
  eat = "eat",
  makeSpear = "makeSpear",
  goToLocation = "goToLocation"
}

export interface Action {
  action: ActionType
  timestamp: Date
}

export type EatAction = Action
export type ScavengAction = Action
export type HuntAction = Action
export interface GoToLocation extends Action {
  location: GameLocation | null
}
export interface MakeSpearAction extends Action {
  count: number
}

function scavenge(state: GameState) {
  state.scrap = state.scrap + 1 

  if(state.currentLocation?.name === locations.groceryStore.name) {
    state.food = state.food + 1
  }

  if(state.currentLocation?.name === locations.factory.name) {
    state.scrap = state.scrap + 1
  }
}
function eat(state: GameState) {
  const change = state.currentLocation?.name === locations.apartment.name ? 
    0.3 :
    0.2
  state.hunger = min([1, state.hunger + change]) as number
  state.food--
}
function hunt(state: GameState) {
  state.food = state.food + state.spears + 1
}
function makeSpear(state: GameState, { count }: MakeSpearAction) {
  state.spears = state.spears + count
  state.scrap = state.scrap - 10
}
function goToLocation(state: GameState, { location }: GoToLocation) {
  state.currentLocation = location
}

interface ActionCondPair<T extends Action> {
  0(action: Action): action is T
  1(state: GameState, action: T): void
}

const isOfActionType = <T extends Action>(actionType: ActionType) => (
  action: Action
): action is T => {
  return actionType === action.action
}

const reducerConds: ActionCondPair<Action>[] = [
  [isOfActionType<MakeSpearAction>(ActionType.makeSpear), makeSpear],
  [isOfActionType<EatAction>(ActionType.eat), eat],
  [isOfActionType<HuntAction>(ActionType.hunt), hunt],
  [isOfActionType<ScavengAction>(ActionType.scavenge), scavenge],
  [isOfActionType<GoToLocation>(ActionType.goToLocation), goToLocation]
]

export const reduceState = (state: GameState, actions: Action[]) => {
  return actions.reduce((state, action) => {
    const pairs = reducerConds.map(
      (condPair): CondPair<Action, GameState> => {
        return [
          (val: Action) => condPair[0](val),
          (action: Action) => produce(state, (draftState: GameState) => condPair[1](draftState, action))
        ]
      }
    )
    return cond(pairs)(action)
  }, state)
}
