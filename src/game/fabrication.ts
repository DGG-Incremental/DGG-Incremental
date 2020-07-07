import { ResourceType } from "./items";
import { GameState } from "./resource";
import { merge } from "lodash";

export interface GenericFabricatorState<D> {
	startTime: D;
	blueprint: BlueprintType;
}

export enum BlueprintType {
	wire = "wire",
}

export interface Blueprint {
	interval: number;
	cost: { item: ResourceType; count: number }[];
	output: { item: ResourceType; count: number }[];
}

export const Blueprints: { [index in BlueprintType]: Blueprint } = {
	[BlueprintType.wire]: {
		interval: 3 * 1000,
		cost: [{ item: ResourceType.metal, count: 3 }],
		output: [{ item: ResourceType.wire, count: 1 }],
	},
};

interface FabricationHandler {
	(args: { state: GameState; start: Date; target: Date }): GameState;
}

export const FabricationHandler: { [s in BlueprintType]: FabricationHandler } = {
	[BlueprintType.wire]: ({ state, start, target }) => {
		const { cost, output } = Blueprints[BlueprintType.wire];
		const gain = getFabricatorDelta(state, start, target, BlueprintType.wire);
		// return merge(state, {
		// 	resources: {
		// 		wire: (state.resources.wire || 0) + 0,
		// 	},
		// } as GameState);
		return state;
	},
};

export function getFabricatorDelta(
	state: GameState,
	start: Date,
	target: Date,
	blueprint: BlueprintType
): {
	completedDeltaIntervals: number;
	currentIntervalProgress: number;
	completedIntervals: number;
} {
	const { interval } = Blueprints[blueprint];
	const completedTime = state.lastSynced.getTime() - start.getTime();
	const completedIntervals = completedTime / interval;
	const deltaTime = target.getTime() - state.lastSynced.getTime();
	const deltaIntervals = (completedIntervals % 1) + deltaTime / interval;
	return {
		completedDeltaIntervals: Math.floor(deltaIntervals),
		currentIntervalProgress: deltaIntervals % 1,
		completedIntervals: Math.floor(completedIntervals),
	};
}

export const applyFabricators = (game: GameState, target: Date) => {
	// return game.fabricators.reduce((state, fabricatorState) => {
	// 	if (fabricatorState) {
	// 		return FabricationHandler[fabricatorState.blueprint]({
	// 			state,
	// 			start: fabricatorState.startTime,
	// 			target,
	// 		});
	// 	} else {
	// 		return state;
	// 	}
	// }, game);
};
