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
  // hunger(state, timestamp) {
  //   const time = timestamp.getTime() - state.lastSynced.getTime();
  //   const change = CONFIG.BASE_HUNGER_RATE * time;
  //   const hunger = max([state.hunger + change, 0]) as number;
  //   return { ...state, hunger };
  // },
  // scavenge(state, timestamp) {
  //   const time = timestamp.getTime() - state.lastSynced.getTime();
  //   let change = 0;
  //   if (state.currentLocation != null) {
  //     change = CONFIG.BASE_SCAVENGE_RATE * time;
  //   }
  //   const scavenge = clamp(state.scavenge + change, 0, 1) as number;

  //   return { ...state, scavenge };
  // },
  tasks(state, timestamp) {
    return applyTasks(state, timestamp)
  }
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
// export const getPassiveState: (
//   state: GameState,
//   timestamp: Date,
// ) => GameState = (state, timestamp) => flow(transformFns.map(t => partialRight(t, timestamp))(state)
