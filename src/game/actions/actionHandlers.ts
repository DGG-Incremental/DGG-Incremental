import * as Resource from '../resource'
import { ActionHandler } from "./types";
import { curry, curryRight } from 'lodash';
import { compose } from 'lodash/fp';
import * as Fabricator from '../fabricators';


export const scavengeMetal: ActionHandler<Resource.GameResources> = Resource.incResource( Resource.Resource.metal )

export const makeWire: ActionHandler<Resource.GameResources> =
  compose(
    Resource.incResource( Resource.Resource.wire ),
    Resource.decResource( Resource.Resource.metal ),
    Resource.decResource( Resource.Resource.metal )
  )

export const addFabricator: ActionHandler<Fabricator.Fabricators> = Fabricator.addFabricator

