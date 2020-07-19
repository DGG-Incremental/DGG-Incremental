import { chain as ActionQueue } from "lodash"
import { Action, GameAction } from "./types"

export interface AbstractActionQueue<A> {
  actionQueue: Action<A>[]
}

export const createActionQueue = <A>(): AbstractActionQueue<A> => {
  return {
    actionQueue: []
  }
}

export const getActionQueue = <A, G extends AbstractActionQueue<A>>( queue: G ): Action<A>[] => queue.actionQueue

export const pushActionQueue = <A, G extends AbstractActionQueue<A>>( queue: G, action: Action<A> ): G => {
  return {
    ...queue,
    actionQueue: [...queue.actionQueue, action]
  }
}

export interface AbstractActionService<A, G extends AbstractActionQueue<A> = AbstractActionQueue<A>> {
  ( game: G, action: Action<A> ): G
}

interface ReduceActionArgs<A, G extends AbstractActionQueue<A>> {
  game: G
  targetTime: Date
  actionService: AbstractActionService<A, G>
}

export const reduceActions = <A, G extends AbstractActionQueue<A>>( { actionService, game, targetTime }: ReduceActionArgs<A, G> ) => {
  return ActionQueue( getActionQueue<A, G>( game ) )
    .filter( action => action.timestamp <= targetTime )
    .orderBy( action => action.timestamp )
    .reduce( ( accGame, action ) => {
      return actionService( accGame, action )
    }, game )
    .value() as G
}

export type ActionQueue = AbstractActionQueue<GameAction>