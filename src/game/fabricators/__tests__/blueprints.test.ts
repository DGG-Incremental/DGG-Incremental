import * as Game from '../../game'
import * as Blueprints from '../blueprints'
import * as Resource from '../../resource'


describe( 'blueprints', () => {
  describe( 'wireFabricator', () => {
    test( 'should add 1 wire and subtract two metal', () => {
      const game = Resource.setResource( Game.createGame(), Resource.Resource.metal, 2 )
      const result = Blueprints.wireFabricator( game )
      expect( Resource.getResource( result, Resource.Resource.metal ) ).toEqual( 0 )
      expect( Resource.getResource( result, Resource.Resource.wire ) ).toEqual( 1 )
    } )
  } )
} )