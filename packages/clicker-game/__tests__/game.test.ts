import { Game, ActionType } from "../lib"
import { dateGen } from "./helpers"


test("first scavenge gives one scrap", () => {
  const game = new Game()
  expect(game.getCurrentState().scrap).toBe(0)
  game.scavenge(new Date())
  expect(game.getCurrentState().scrap).toBe(1)
})

test("scavenge ads scavenge action to queue", () => {
  const game = new Game()
  const timestamp = new Date()

  game.scavenge(timestamp)

  expect(game.state.actions.length).toBe(1)
  expect(game.state.actions[0].action).toBe(ActionType.scavenge)
  expect(game.state.actions[0].timestamp).toBe(timestamp)
})

test("each scavenge gives gives one scrap", () => {
  const game = new Game()
  game.scavenge(new Date())
  game.scavenge(new Date())

  expect(game.getCurrentState().scrap).toBe(2)
})

test("init with state set actions", () => {
  const [a, b, c, d, e] = dateGen()
  const game = new Game({
    actions: [{ action: ActionType.scavenge, timestamp: b }],
    lastSynced: a
  })
  expect(game.getStateAt(c).scrap).toBe(1)
  game.scavenge(d)
  expect(game.state.actions.length).toBe(2)
  expect(game.getStateAt(e).scrap).toBe(2)
})

test("hunger goes down over time", () => {
  const [a, b] = dateGen(10 * 1000)
  const game = new Game({lastSynced: a})
  expect(game.getStateAt(a).hunger).toBe(1) 
  expect(game.getStateAt(b).hunger).toBe(0.9) 
})

test("hunger doesn't go below zero", () => {
  const [a, b] = dateGen(11 * 10 * 1000)
  const game = new Game({lastSynced: a})
  expect(game.getStateAt(a).hunger).toBe(1) 
  expect(game.getStateAt(b).hunger).toBe(0) 
})

test("hunting gives food", () => {
  const [a,b] = dateGen()
  const game = new Game({lastSynced: a})
  expect(game.getStateAt(a).food).toBe(0)
  game.hunt(a)
  expect(game.getStateAt(b).food).toBe(1)  
})


test("hunting with spears gives more food", () => {
  const [a,b] = dateGen()
  const game = new Game({lastSynced: a, spears: 1})
  game.hunt(a)
  expect(game.getStateAt(b).food).toBe(2)
})

test("eating food lowers food and hunger", () => {
  const [a,b ] = dateGen()
  const game = new Game({lastSynced: a, food: 1, hunger: 0.5})
  game.eat(a)
  expect(game.getStateAt(b).hunger).toBeGreaterThan(0.5)
  expect(game.getStateAt(b).food).toBe(0)
})
