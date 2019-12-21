const Game = require("../lib/game")

test("click adds 1 to score", () => {
  const game = new Game()
  expect(game.getCurrentState().pepes).toBe(0)
  game.clickPepe()
  expect(game.getCurrentState().pepes).toBe(1)
})

test("click pushes a click action to actions queue", () => {
  const game = new Game()
  expect(game.state.actions).toEqual([])
  game.clickPepe()
  expect(game.state.actions.length).toBe(1)
  expect(game.state.actions[0].action).toBe("clickPepe")
  // expect(game.state.actions[0].timestamp).toBeCloseTo(Date.now(), 10000)
})

test("init with state sets score", () => {
  const game = new Game({ pepes: 1 })
  expect(game.getCurrentState().pepes).toBe(1)
  game.clickPepe()
  expect(game.getCurrentState().pepes).toBe(2)
})

test("init with state set actions", () => {
  const game = new Game({
    actions: [{ action: "clickPepe", timestamp: new Date() }]
  })
  expect(game.getCurrentState().pepes).toBe(1)
  game.clickPepe()
  expect(game.getCurrentState().pepes).toBe(2)
})

// test("addGenerator adds 1 to generators", () => {
//   const now = new Date()
//   const game = new Game()
//   expect(game.getCurrentState().generators).toBe(0)
//   game.addGenerator()
//   expect(game.getCurrentState().generators).toBe(1)

//   expect(game.getCurrentState(new Date(now.getTime() + 1000)).score).toBe(1)
// })

// test("generators produce passsive score", () => {
//   const now = new Date()
//   const game = new Game({generators: 1, lastSynced: now})
//   expect(game.getCurrentState().generators).toBe(1)

//   expect(game.getCurrentState(new Date(now.getTime() + 1000)).score).toBe(1)
// })
