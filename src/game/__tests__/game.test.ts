import * as Game from '../game'


describe('Game', () => {
    const resource: Game.GameResources = 'wire'
    let game = Game.createGame()

    beforeEach(() => game = Game.createGame())
    describe('resources', () => {
        test('it should have empty resources', () => {
            expect(Game.getResource(game, resource)).toEqual(0)
        })
        test('it should set resource', () => {
            const updated = Game.setResource(game, resource, 1)
            expect(Game.getResource(game, resource)).toEqual(1)
        })
    })

})
