import { GameState } from "./game";
import { ItemType } from "./items";

//TODO: will probably have to implement some kind of condition checking to ensure that people can't start tasks they haven't unlocked

export interface GenericTaskState<D> {
  startTime: D;
  task: TaskType;
}

export enum TaskType {
  acquireMetal = "acquireMetal",
}

export interface Task {
  time: number;
  cooldown: number;
  charges: number;
  // cost: { item: ItemType; count: number }[];
  onComplete: (state: GameState, elapsed: number) => void;
}

export const Tasks: { [index in TaskType]: Task } = {
  [TaskType.acquireMetal]: {
    time: 0.5 * 1000,
    cooldown: 5 * 1000,
    charges: 10,
    // cost: [],
    onComplete: (state: GameState, elapsed = 1) => {
      state.test += elapsed;
    },
  },
};
