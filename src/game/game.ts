import merge from "lodash/merge";
import flow from "lodash/flow";
import filter from "lodash/filter";
import partial from "lodash/partial";
import partialRight from "lodash/partialRight";
import { Action, ActionType, MakeSpearAction, GoToLocation, applyAction, GenericAction } from "./actions";
import { exceedsRateLimit } from "./validations";
import { getPassiveState } from "./passive";
import { GameLocation, locations } from "./locations";

import { Resource, ResourceType } from "./items";
import { GenericTaskState, TaskType, applyTasks } from "./tasks";
import { Fabricator } from "./fabricator";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
};

export type GameResources = {
  [key in ResourceType]: number
}

export interface GenericGameState<D> {
  // Tracks current owned resources
  resources: GameResources;

  // Array of actions taken by the user
  // These are used to transition the current state to a new state
  actions: GenericAction<D>[];

  // The last time the actions were synced to the current state
  lastSynced: Date;

  // Fabricators are used to produce resources from other resources
  fabricators: Fabricator[]

  itemSlots: number;
  tasks: GenericTaskState<D>[];
}

export interface SerializedGameState extends GenericGameState<string> { }

export interface GameState extends GenericGameState<Date> { }

export class Game {
  state: GameState = {
    // TODO: Fix cloneDeep mess here
    resources: {
      [ResourceType.metal]: 0,
      [ResourceType.wire]: 0,
    },
    tasks: [],
    itemSlots: 9,
    actions: [],
    fabricators: [],
    lastSynced: new Date(0),
  };

  constructor(state: DeepPartial<GameState> = {}) {
    merge(this.state, state);

    if (this.state.lastSynced) {
      this.state.lastSynced = new Date(this.state.lastSynced);
    }
  }

  pushAction(action: Action) {
    this.state.actions.push(action);
    // this.state = { ...this.state, actions: [...this.state.actions, action] };
  }

  testAction(timestamp: Date) {
    this.pushAction({ action: ActionType.test, timestamp });
  }

  test2Action(timestamp: Date) {
    this.pushAction({ action: ActionType.test2, timestamp });
  }

  getCurrentState() {
    return this.getStateAt(new Date());
  }

  getStateAt(timestamp: Date): GameState {
    const { lastSynced, actions } = this.state;
    const targetActions = filter(actions, (a: Action) => a.timestamp.getTime() >= lastSynced.getTime() && a.timestamp.getTime() <= timestamp.getTime());
    const applied = targetActions.reduce((state, action) => {
      const passiveState = getPassiveState(state, action.timestamp);
      return applyAction(action, passiveState);
    }, this.state);
    return getPassiveState(applied, timestamp);
  }

  validate() {
    if (exceedsRateLimit(this)) {
      throw "Too many actions";
    }
  }

  fastForward(game: Game) {
    // Return a game object that is passed game + actions in current game that
    // have a time stamp after passed game
    const actions = this.state.actions.filter((a) => a.timestamp > game.state.lastSynced);
    return new Game({
      ...game.state,
      actions,
    });
  }
}
