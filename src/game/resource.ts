import { cloneDeep } from "lodash";

// type DeepPartial<T> = {
//   [P in keyof T]?: T[P] extends Array<infer U>
//   ? Array<DeepPartial<U>>
//   : T[P] extends ReadonlyArray<infer U>
//   ? ReadonlyArray<DeepPartial<U>>
//   : DeepPartial<T[P]>
// };
export enum ResourceType {
	metal = "metal",
	wire = "wire",
}

export interface Resource {
	name: string;
	shortname: string;
	icon: string;
}

export const Resources: { [key in ResourceType]: Resource } = {
	[ResourceType.metal]: {
		name: "metal",
		shortname: "MTL",
		icon: "",
	},
	[ResourceType.wire]: {
		name: "wire",
		shortname: "WIR",
		icon: "",
	},
};

export interface HasResources  {
  resources: {
    [type in ResourceType]: number
  }
}

const INITIAL_RESOURCES: {[type in ResourceType]: number} = {
  metal: 0,
  wire: 0
}

export const createResources = (): HasResources  => {
  const resources = cloneDeep(INITIAL_RESOURCES)

  return {
    resources
  }
}

export const getResource = (game: HasResources, resource: ResourceType) => {
  return game.resources[resource]
}

export const setResource = <T extends HasResources>(game: T, resource: ResourceType, amount: number): T => {
  return {
    ...game,
    resources: {
      ...game.resources,
      [resource]: amount
    }
  }
}



// export class Game {
//   state: GameState = {
//     // TODO: Fix cloneDeep mess here
//     resources: {
//       [ResourceType.metal]: 0,
//       [ResourceType.wire]: 0,
//     },
//     tasks: [],
//     itemSlots: 9,
//     actions: [],
//     fabricators: [],
//     lastSynced: new Date(0),
//   };

//   constructor(state: DeepPartial<GameState> = {}) {
//     merge(this.state, state);

//     if (this.state.lastSynced) {
//       this.state.lastSynced = new Date(this.state.lastSynced);
//     }
//   }

//   pushAction(action: Action) {
//     this.state.actions.push(action);
//     // this.state = { ...this.state, actions: [...this.state.actions, action] };
//   }

//   testAction(timestamp: Date) {
//     this.pushAction({ action: ActionType.test, timestamp });
//   }

//   test2Action(timestamp: Date) {
//     this.pushAction({ action: ActionType.test2, timestamp });
//   }

//   getCurrentState() {
//     return this.getStateAt(new Date());
//   }

//   getStateAt(timestamp: Date): GameState {
//     const { lastSynced, actions } = this.state;
//     const targetActions = filter(actions, (a: Action) => a.timestamp.getTime() >= lastSynced.getTime() && a.timestamp.getTime() <= timestamp.getTime());
//     const applied = targetActions.reduce((state, action) => {
//       const passiveState = getPassiveState(state, action.timestamp);
//       return applyAction(action, passiveState);
//     }, this.state);
//     return getPassiveState(applied, timestamp);
//   }

//   validate() {
//     if (exceedsRateLimit(this)) {
//       throw "Too many actions";
//     }
//   }

//   fastForward(game: Game) {
//     // Return a game object that is passed game + actions in current game that
//     // have a time stamp after passed game
//     const actions = this.state.actions.filter((a) => a.timestamp > game.state.lastSynced);
//     return new Game({
//       ...game.state,
//       actions,
//     });
//   }
// }
