const Game = require('./game')

test('click adds 1 to score', () => {
	const game = new Game()
	expect(game.getCurrentState().score).toBe(0)
	game.click()
	expect(game.getCurrentState().score).toBe(1)
})

test('click pushes a click action to actions queue', () =>{
	const game = new Game()
	expect(game.state.actions).toEqual([])
	game.click()
	expect(game.state.actions.length).toBe(1)	
	expect(game.state.actions[0].action).toBe('click')
	// expect(game.state.actions[0].timestamp).toBeCloseTo(Date.now(), 10000)
})


test('init with state sets score', () => {
	const game = new Game({score: 1})
	expect(game.getCurrentState().score).toBe(1)
	game.click()
	expect(game.getCurrentState().score).toBe(2)
})

test('init with state set actions', () => {
	const game = new Game({actions: [{action: 'click', timestamp: Date.now()}]})
	expect(game.getCurrentState().score).toBe(1)
	game.click()
	expect(game.getCurrentState().score).toBe(2)
})