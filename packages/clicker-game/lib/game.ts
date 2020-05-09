import merge from "lodash/merge";
import flow from "lodash/flow";
import filter from "lodash/filter";
import partial from "lodash/partial";
import partialRight from "lodash/partialRight";
import { Action, ActionType, MakeSpearAction, GoToLocation, applyAction, GenericAction } from "./actions";
import { exceedsRateLimit } from "./validations";
import { getPassiveState } from "./passive";
import { GameLocation, locations } from "./locations";

import { Item, ItemType } from "./items";
import { GenericTaskState, TaskType } from "./tasks";

export interface GenericGameState<D> {
  items: { [key in ItemType]?: { count: number } };
  actions: GenericAction<D>[];
  lastSynced: Date;
  itemSlots: number;
  tasks: GenericTaskState<D>[];
  test: number;
}

export interface SerializedGameState extends GenericGameState<string> {}

export interface GameState extends GenericGameState<Date> {}

export class Game {
  state: GameState = {
    // TODO: Fix cloneDeep mess here
    test: 0,
    items: {
      [ItemType.metal]: { count: 1 },
    },
    tasks: [],
    itemSlots: 9,
    actions: [],
    lastSynced: new Date(0),
  };

  constructor(state: Partial<GameState> = {}) {
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
