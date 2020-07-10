import { chain } from "lodash"

export interface Action<A> {
  action: A;
  timestamp: Date
}

export interface HasActionQueue<A> {
  actionQueue: Action<A>[]
}


export const createActionQueue = <A>(): HasActionQueue<A> => {
  return {
    actionQueue: []
  }
}

export const getActionQueue = <A, G extends HasActionQueue<A>>(queue: G): Action<A>[] => queue.actionQueue

export const pushActionQueue = <A, G extends HasActionQueue<A>>(queue: G, action: Action<A>): G => {
  return {
    ...queue,
    actionQueue: [...queue.actionQueue, action]
  }
}

export interface AbstractActionService<A, G extends HasActionQueue<A> = HasActionQueue<A>> {
  (game: G, action: Action<A>): G
}

interface ReduceActionArgs<A, G extends HasActionQueue<A>> {
  game: G
  targetTime: Date
  actionService: AbstractActionService<A, G>
}

export const reduceActions = <A, G extends HasActionQueue<A>>({ actionService, game, targetTime }: ReduceActionArgs<A, G>) => {
  return chain(getActionQueue<A, G>(game))
    .filter(action => action.timestamp <= targetTime)
    .orderBy(action => action.timestamp)
    .reduce((accGame, action) => {
      return actionService(accGame, action)
    }, game)
    .value() as G
}
