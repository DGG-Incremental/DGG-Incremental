import { CondPair } from "lodash"
import cond from "lodash/cond"
import min from "lodash/min"
import { GameState } from "./game"


export enum ActionType {
  scavenge = "scavenge",
  hunt = "hunt",
  eat = "eat",
  makeSpear = "makeSpear"
}

export interface Action {
  action: ActionType
  timestamp: Date
}

export type EatAction = Action
export type ScavengAction = Action
export type HuntAction = Action
export interface MakeSpearAction extends Action {
  count: number
}

function scavenge(state: GameState) {
  state.scrap = state.scrap + 1
  return state
}
function eat(state: GameState) {
  state.hunger = min([state.hunger, state.hunger + 0.2]) as number
  state.food--
  return state
}
function hunt(state: GameState) {
  state.food = state.food + 1
  return state
}
function makeSpear(state: GameState, { count }: MakeSpearAction) {
  state.spears = state.spears + count
  state.scrap = state.scrap - 10
  return state
}

interface ActionCondPair<T extends Action> {
  0(action: Action): action is T
  1(state: GameState, action: T): GameState
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
  [isOfActionType<ScavengAction>(ActionType.scavenge), scavenge]
]

export const reduceState = (state: GameState, actions: Action[]) => {
  return actions.reduce((state, action) => {
    const pairs = reducerConds.map(
      (c): CondPair<Action, GameState> => {
        return [
          (val: Action) => c[0](val),
          (action: Action) => c[1](state, action)
        ]
      }
    )
    return cond(pairs)(action)
  }, state)
}
