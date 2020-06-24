import { GameState } from "./game";
import merge from "lodash/merge";
import { ResourceType } from "./items";
import floor from "lodash/floor";
import min from "lodash/min";

//TODO: will probably have to implement some kind of condition checking to ensure that people can't start tasks they haven't unlocked

export interface GenericTaskState<D> {
	startTime: D;
	task: TaskType;
}

export enum TaskType {
	acquireMetal = "acquireMetal",
	// buildBox = "buildBox"
}

export interface Task {
	interval: number;
	cooldown: number;
	charges: number;
	// cost: { item: ItemType; count: number }[];
}

export const Tasks: { [index in TaskType]: Task } = {
	[TaskType.acquireMetal]: {
		interval: 0.5 * 1000,
		cooldown: 5 * 1000,
		charges: 10,
		// cost: [],
	},
};

interface TaskHandler {
	(args: { state: GameState; start: Date; target: Date }): GameState;
}

export const TaskHandlers: { [s in TaskType]: TaskHandler } = {
	[TaskType.acquireMetal]: ({ state, start, target }) => {
		const { interval, cooldown, charges } = Tasks[TaskType.acquireMetal];
		const activeTime = interval * charges; // how long the task yields resources until CD
		const cycleTime = activeTime + cooldown; // the time between starting the task and finishing the cooldown
		const activeRatio = activeTime / cycleTime; // The ratio of active yield time to the length of the cooldown

		const delta = target.getTime() - start.getTime(); // The span of time the handler is calculating
		const completedCycleProgress = delta / cycleTime; // how many cycles were completed (with current cycle in decimal)
		const completedCycles = floor(completedCycleProgress); // how many cycles were completed
		const currentCycleCompletedRatio = min([completedCycleProgress - completedCycles, activeRatio]); // Fuzzy progress on current cycle

		if (currentCycleCompletedRatio === undefined) {
			throw new Error("Current progres is undefined");
		}

		const currentCycleCompletedInterval = (currentCycleCompletedRatio * cycleTime) / interval; // How many interval completed
		const totalProgress = completedCycles * charges + floor(currentCycleCompletedInterval);
		return merge(state, {
			resources: { metal: state.resources.metal + totalProgress },
		} as GameState);
	},
};

export const applyTasks = (game: GameState, target: Date) => {
	return game.tasks.reduce((state, task) => {
		return TaskHandlers[task.task]({ state, start: task.startTime, target });
	}, game);
};
