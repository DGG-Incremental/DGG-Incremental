import * as ActionService from '../actionService'

describe( 'actionService', () => {
    const ACTION_NAME = 'scavenge'
    const ACTION = jest.fn()
    const GAME = jest.fn()

    test( 'it does nothing when no actions', () => {
        const actionService = ActionService.createActionService( [] )
        expect( actionService( ACTION_NAME, GAME ) ).toBe( undefined )
    } )

    test( 'it calls matching action', () => {
        const actionService = ActionService.createActionService( [[ACTION_NAME, ACTION]] )
        expect( actionService( ACTION_NAME, GAME ) ).toBe( undefined )
        expect( ACTION.mock.calls.length ).toBe( 1 )
        expect( ACTION.mock.calls[0] ).toEqual( [ACTION_NAME, GAME] )
    } )
} )
