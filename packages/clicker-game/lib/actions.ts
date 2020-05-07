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
}

export interface GenericAction<D> {
  action: ActionType;
  timestamp: D;
}
export interface Action extends GenericAction<Date> {}
export interface SerializedAction extends GenericAction<string> {}

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

function test(state: GameState, action: TestAction) {
  state.tasks.push({
    task: TaskType.acquireMetal,
    startTime: action.timestamp,
  });
}

// function scavenge(state: GameState) {
//   state.scrap = state.scrap + 1;

//   if (state.currentLocation?.name === locations.groceryStore.name) {
//     state.food = state.food + 1;
//   }

//   if (state.currentLocation?.name === locations.factory.name) {
//     state.scrap = state.scrap + 1;
//   }
// }
// function eat(state: GameState) {
//   const change = state.currentLocation?.name === locations.apartment.name ? 0.3 : 0.2;
//   state.hunger = clamp(state.hunger + change, 0, 1) as number;
//   state.food--;
// }
// function hunt(state: GameState) {
//   state.food = state.food + state.spears + 1;
// }
// function makeSpear(state: GameState, { count }: MakeSpearAction) {
//   state.spears = state.spears + count;
//   state.scrap = state.scrap - 10;
// }
// function goToLocation(state: GameState, { location }: GoToLocation) {
//   state.currentLocation = location;
//   state.scavenge = 0;
// }

interface ActionCondPair<T extends Action> {
  0(action: Action): action is T;
  1(state: GameState, action: T): void;
}

const isOfActionType = <T extends Action>(actionType: ActionType) => (action: Action): action is T => {
  return actionType === action.action;
};

const reducerConds: ActionCondPair<Action>[] = [
  [isOfActionType<TestAction>(ActionType.test), test],
  // [isOfActionType<MakeSpearAction>(ActionType.makeSpear), makeSpear],
  // [isOfActionType<EatAction>(ActionType.eat), eat],
  // [isOfActionType<HuntAction>(ActionType.hunt), hunt],
  // [isOfActionType<ScavengAction>(ActionType.scavenge), scavenge],
  // [isOfActionType<GoToLocation>(ActionType.goToLocation), goToLocation],
];

export const applyAction = (action: Action, state: GameState): GameState => {
  const pairs = reducerConds.map(
    (condPair): CondPair<Action, GameState> => {
      return [(val: Action) => condPair[0](val), (action: Action) => produce(state, (draftState: GameState) => condPair[1](draftState, action))];
    }
  );
  return { ...cond(pairs)(action), lastSynced: action.timestamp };
};
