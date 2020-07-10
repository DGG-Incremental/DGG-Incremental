import * as Actions from './actions'
import * as Fabricators from './fabricators'
import * as Resources from './resource'
export { pushActionQueue, reduceActions } from './actions'
export { setResource, getResource } from './resource'
export { addFabricator, applyFabricators, createFabricators } from './fabricators'

export type GameActions = 'scavengeMetal' | 'makeWire' | 'addWireFabricator'
export type GameFabricators = 'wireFabricator'
export type GameResources = 'wire' | 'metal'

export interface Game extends
    Actions.HasActionQueue<GameActions>,
    Fabricators.HasFabricators<GameFabricators>,
    Resources.HasResources<GameResources> {
}

export const createGame = (): Game => {
    return {
        ...Actions.createActionQueue(),
        ...Fabricators.createFabricators(),
        ...Resources.createResources()
    }
}
