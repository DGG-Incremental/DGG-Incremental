import { AbstractActionService, HasActionQueue, Action } from '../actions'
import { cond } from 'lodash'
import { HasResources, Resource } from '../resource'
import { GameResources } from '../game'

export type GameAction = 'scavengeMetal' | 'makeWire' | 'addWireFabricator'

interface ActionService extends AbstractActionService<GameAction, HasResources<GameResources> & HasActionQueue<GameAction>> {

}

export const actionService: ActionService = (game, action) => {
    return {

    }[action.action]
}

