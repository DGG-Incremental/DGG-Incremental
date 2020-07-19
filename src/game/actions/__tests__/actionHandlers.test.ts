import * as ActionHandler from '../actionHandlers'
import * as Resource from '../../resource'
import * as Fabricator from '../../fabricators'
import * as Game from '../../game'
import { mocked } from 'ts-jest/utils'
import { GameAction } from '../types'
import { compose } from 'lodash/fp'

describe( 'actionHandlers', () => {
  let game = mocked( Game.createGame() )
  const SCAVANGE = GameAction.scavengeMetal

  beforeEach( () => game = mocked( Game.createGame() ) )

  describe( 'scavenge', () => {
    test( 'should add one metal to resources', () => {
      const result = ActionHandler.scavengeMetal( game, SCAVANGE )
      expect( Resource.getResource( result, Resource.Resource.metal ) ).toBe( 1 )
    } )

    test( 'should add 2 metal to resources', () => {
      let updated = ActionHandler.scavengeMetal( game, SCAVANGE )
      updated = ActionHandler.scavengeMetal( updated, SCAVANGE )
      expect( Resource.getResource( updated, Resource.Resource.metal ) ).toBe( 2 )
    } )
  } )

  describe( 'makeWire', () => {
    beforeEach( () => {
      game = compose(
        mocked,
        ActionHandler.scavengeMetal,
        ActionHandler.scavengeMetal,
        Game.createGame
      )()
    } )
    const MAKE_WIRE = GameAction.makeWire
    test( 'should add one wire and subtract 2 metal to resources', () => {
      const result = ActionHandler.makeWire( game, MAKE_WIRE )
      expect( Resource.getResource( result, Resource.Resource.wire ) ).toBe( 1 )
      expect( Resource.getResource( result, Resource.Resource.metal ) ).toBe( 0 )
    } )
  } )

  const FABRICATOR: Fabricator.Fabricator = {
    blueprint: Fabricator.GameBlueprint.wireFabricator,
    finish: null,
    start: null
  }

  describe( 'addFabricator', () => {
    test( 'it should add one fabricator', () => {
      const result = ActionHandler.addFabricator( game, GameAction.addFabricator )
      expect( Fabricator.getFabricators( result ) ).toEqual( [null] )
    } )
  } )

  describe( 'setFabricator', () => {
    test( 'it should add a wire fabricator', () => {
      const added = ActionHandler.addFabricator( game, GameAction.addFabricator )
      const set = Fabricator.setFabricator( added, 0, FABRICATOR )
      expect( Fabricator.getFabricators( set ) ).toEqual( [FABRICATOR] )
    } )
  } )
} )