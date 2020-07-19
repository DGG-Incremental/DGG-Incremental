import * as ActionQueue from './actions'
import * as Fabricators from './fabricators'
import * as Resources from './resource'
export { setResource, getResource } from './resource'
export { addFabricator, createFabricators } from './fabricators'

export interface Game extends
  ActionQueue.ActionQueue,
  Fabricators.Fabricators,
  Resources.GameResources {
}

export const createGame = (): Game => {
  return {
    ...ActionQueue.createActionQueue(),
    ...Fabricators.createFabricators(),
    ...Resources.createResources()
  }
}
