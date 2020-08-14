import { __, curry, lensProp, set, head, sortBy, slice, concat } from "ramda"
import { Game, Action } from "../types"

const queueLens = lensProp('actionQueue')
const actionSortProp = (action: Action) => action.timestamp.getTime()
const appendAndSortActions = (actions: Action[], queue: Array<Action>) => {
    return sortBy(actionSortProp, concat(queue, actions))
}

export const getActionQueueSize = (game: Game) => game.actionQueue.length
export const peekAction = (game: Game) => head(game.actionQueue)
export const enqueueActions = curry((actions: Action[], game: Game) => set(queueLens, appendAndSortActions(actions, game.actionQueue), game))
export const enqueueAction = curry((action: Action, game: Game) => enqueueActions([action], game))
export const dequeueAction = (game: Game) => [peekAction(game), set(queueLens, slice(1, Infinity, game.actionQueue), game)] as [Action | undefined, Game]
