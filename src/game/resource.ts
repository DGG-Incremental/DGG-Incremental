import { get, constant, set } from 'lodash/fp'
import { set as s} from 'ramda'



export type ResourceCollection<R extends string> = Record<R, number>

interface IResourceModule<R extends string> {
  createResourceCollection(): ResourceCollection<R>
  getResource( resource: R, collection: ResourceCollection<R> )
  setResource( resource: R, n: number, collection: ResourceCollection<R> )
}

export const createResourceModule = <R extends string>() => {
  return {
    createResourceCollection: constant( {} as Record<R, number> ),
    getResource: get,
    setResource: set
  } as IResourceModule<R>
}

export type GameResource = 'metal' | 'wire'
export default createResourceModule<GameResource>()

