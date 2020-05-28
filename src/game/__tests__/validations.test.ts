import { Game, ActionType } from "../lib"
import { exceedsRateLimit } from "../lib/validations"

test("exceedsRateLimit returns false whewn no actions", () => {
  const rateLimit = 1 // per second

  const game = new Game()
  expect(exceedsRateLimit(game, rateLimit)).toBe(false)
})

// test("exceedsRateLimit returns false when under limit", () => {
//   const rateLimit = 1 // per second

//   const game = new Game()
//   const first = new Date("2020")
//   const second = new Date(first.getTime() + 1001)
//   console.log(first)
//   console.log(second)

//   game.pushAction(ActionType.clickPepe, first)
//   game.pushAction(ActionType.clickPepe, second)
//   expect(exceedsRateLimit(game, rateLimit)).toBe(false)
// })

// test("exceedsRateLimit returns true when over limit", () => {
//   const rateLimit = 1 // per second
//   const first = new Date("2019")
//   const second = new Date(first.getTime() + 500)
//   const game = new Game()
//   game.pushAction(ActionType.clickPepe, first)
//   game.pushAction(ActionType.clickPepe, second)
//   expect(exceedsRateLimit(game, rateLimit)).toBe(true)
// })

// test("exceedsRateLimit returns true when over limit", () => {
//   const rateLimit = 2 // per second

//   const game = new Game()
//   game.clickPepe()
//   game.clickPepe()
//   expect(exceedsRateLimit(game, rateLimit)).toBe(false)
// })
