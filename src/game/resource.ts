export interface HasResources<R extends string> {
  resources: Map<R, number>
}

export const createResources = <R extends string>(): HasResources<R> => {
  return {
    resources: new Map()
  }
}

export const getResource = <R extends string>(game: HasResources<R>, resource: R) => {
  return game.resources.get(resource) || 0
}

export const setResource =  <R extends string>(game: HasResources<R>, resource: R, n: number): HasResources<R> => {
  return {
    ...game,
    resources: game.resources.set(resource, n)
  }
}

export type Resource =  'wire' | 'metal'