import { append, __, curry, lensProp, set, head, pipe, compose, sortBy, path, call, prop, slice } from "ramda"
import { Game, Action } from "../types"

const queueLens = lensProp('actionQueue')
const appendAndSortAction = (action: Action, queue: Array<Action>) => {
    const actionSortProp = (action: Action) => action.timestamp.getTime()
    return sortBy(actionSortProp, append(action, queue))
}

export const getActionQueueSize = (game: Game) => game.actionQueue.length
export const peekAction = (game: Game) => head(game.actionQueue)
export const enqueueAction = curry((action: Action, game: Game) => set(queueLens, appendAndSortAction(action, game.actionQueue), game))
export const dequeueAction = (game: Game) => [peekAction(game), set(queueLens, slice(1, Infinity, game.actionQueue), game)] as [Action | undefined, Game]
