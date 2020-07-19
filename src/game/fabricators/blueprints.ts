import * as Resource from '../resource'
import { compose } from 'lodash/fp'

export const wireFabricator = compose(
  Resource.decResource( Resource.Resource.metal ),
  Resource.decResource( Resource.Resource.metal ),
  Resource.incResource( Resource.Resource.wire )
)