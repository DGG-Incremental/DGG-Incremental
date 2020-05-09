import { GameState } from "./game";
import CONFIG from "./config";
import flow from "lodash/flow";
import max from "lodash/max";
import clamp from "lodash/clamp";
import partialRight from "lodash/partialRight";
import produce from "immer";
import { Tasks } from "./tasks";

interface PassiveTransformer {
  (state: GameState, timestamp: Date): GameState;
}

export const transformers: { [name: string]: PassiveTransformer } = {
  tasks(state, timestamp) {
    let draft = { ...state };
    state.tasks.forEach((taskState) => {
      const task = Tasks[taskState.task];
      //TODO: this should probably be parsed beforehand like the actions
      const startTime = new Date(taskState.startTime);
      const completed =
        tasksCompleted(timestamp.getTime() - startTime.getTime(), task.time, task.charges, task.cooldown) -
        tasksCompleted(state.lastSynced.getTime() - startTime.getTime(), task.time, task.charges, task.cooldown);
      draft = task.onComplete(draft, completed);
    });
    return draft;
  },
};

function tasksCompleted(time: number, taskTime: number, taskCharges: number, taskCooldown: number) {
  if (!taskCooldown) return time / taskTime;
  if (!taskCharges) return Math.floor(time / taskCooldown);
  let upTime = taskTime * taskCharges;
  let totalTime = upTime + taskCooldown;
  let tasksCompleted = Math.floor(time / totalTime);
  let tasksRemainder = time % totalTime;
  if (tasksRemainder < upTime) {
    return Math.floor(tasksRemainder / taskTime) + taskCharges * tasksCompleted;
  } else {
    return taskCharges * (tasksCompleted + 1);
  }
}

const transformFns = Object.values(transformers);
export const getPassiveState = (state: GameState, timestamp: Date) => transformFns.reduce((newState, fn) => fn(newState, timestamp), state);
