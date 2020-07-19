import { dateGen } from './helpers'
import * as Game from '../game'
import * as Fabricator from '../fabricators'
import * as Resource from '../resource'
import { flow } from 'lodash/fp'
import { curry, curryRight } from 'lodash'

const setResource = curryRight( Resource.setResource )

const addFabricator = Fabricator.addFabricator

const setFabricator = curryRight( Fabricator.setFabricator )

const setupGame = flow(
  Game.createGame,
  setResource( Resource.Resource.metal, 4 ),
  addFabricator,
  setFabricator( { start: null, finish: null, blueprint: Fabricator.GameBlueprint.wireFabricator }, 1 )
)

describe( 'Game', () => {
  let game = setupGame()
  const [FABRICATOR_START, MAKE_WIRE] = dateGen()
  beforeEach( () => game = setupGame() )

  describe( 'fabricators ', () => {
    test( 'pause when no resources', () => {

    } )
  } )

} )
