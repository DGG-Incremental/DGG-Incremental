import { CondPair } from "lodash";
import produce from "immer";
import cond from "lodash/cond";
import min from "lodash/min";
import clamp from "lodash/clamp";
import { GameState } from "./game";
import { GameLocation, locations } from "./locations";
import { TaskType } from "./tasks";

export enum ActionType {
  scavenge = "scavenge",
  hunt = "hunt",
  eat = "eat",
  makeSpear = "makeSpear",
  goToLocation = "goToLocation",
  test = "test",
  test2 = "test2",
}

export interface GenericAction<D> {
  action: ActionType;
  timestamp: D;
}
export interface Action extends GenericAction<Date> { }
export interface SerializedAction extends GenericAction<string> { }

export type EatAction = Action;
export type ScavengAction = Action;
export type HuntAction = Action;
export interface GoToLocation extends Action {
  location: GameLocation | null;
}
export interface MakeSpearAction extends Action {
  count: number;
}
export type TestAction = Action;


interface ActionCondPair<T extends Action> {
  0(action: Action): action is T;
  1(state: GameState, action: T): void;
}

const isOfActionType = <T extends Action>(actionType: ActionType) => (action: Action): action is T => {
  return actionType === action.action;
};

const reducerConds: ActionCondPair<Action>[] = [
];

export const applyAction = (action: Action, state: GameState): GameState => {
  const pairs = reducerConds.map(
    (condPair): CondPair<Action, GameState> => {
      return [(val: Action) => condPair[0](val), (action: Action) => produce(state, (draftState: GameState) => condPair[1](draftState, action))];
    }
  );
  return { ...cond(pairs)(action), lastSynced: action.timestamp };
};
