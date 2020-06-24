import { GameState } from "./game";
import CONFIG from "./config";
import flow from "lodash/flow";
import max from "lodash/max";
import clamp from "lodash/clamp";
import partialRight from "lodash/partialRight";
import { applyTasks } from "./tasks";
import { applyFabricators } from "./fabricator";
import produce from "immer";

interface PassiveTransformer {
	(state: GameState, timestamp: Date): GameState;
}

export const transformers: { [name: string]: PassiveTransformer } = {
	tasks(state, timestamp) {
		return applyTasks(state, timestamp);
	},
};

const transformFns = Object.values(transformers);
export const getPassiveState = (state: GameState, timestamp: Date) =>
	transformFns.reduce((newState, fn) => fn(newState, timestamp), state);
