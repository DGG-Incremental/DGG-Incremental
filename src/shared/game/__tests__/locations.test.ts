import { Game, locations } from "../lib"
import { dateGen } from "./helpers"

test('Grocery store gives food on scavenge', () => {
    const [a,b, c] = dateGen()
    const game = new Game({food: 0, currentLocation: locations.groceryStore, lastSynced: a})
    game.scavenge(b)
    expect(game.getStateAt(c).food).toBe(1)
})

test('Factory gives extra scrap', () => {
    const [a,b,c] = dateGen()
    const game = new Game({currentLocation: locations.factory, lastSynced: a})
    game.scavenge(b)
    expect(game.getStateAt(c).scrap).toBe(2)
})

test('Apartment Complex gives more hunger on eat', () => {
    const [a] = dateGen()
    const game = new Game({currentLocation: locations.apartment, lastSynced: a, hunger: 0.5, food: 1})
    game.eat(a)
    expect(game.getStateAt(a).hunger).toBe(0.8)
})
