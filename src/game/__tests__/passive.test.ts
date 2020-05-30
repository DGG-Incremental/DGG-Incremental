import { Game } from "../game";
import { locations } from "../locations";

import { dateGen } from "./helpers";
import CONFIG from "../config";

test("placeholder", () => {})

// test("hunger goes down over time", () => {
//   const [a, b] = dateGen(10 * 1000);
//   const game = new Game({ lastSynced: a });
//   expect(game.getStateAt(a).hunger).toBe(1);
//   expect(game.getStateAt(b).hunger).toBe(0.9);
// });

// test("hunger doesn't go below zero", () => {
//   const [a, b] = dateGen(11 * 10 * 1000);
//   const game = new Game({ lastSynced: a });
//   expect(game.getStateAt(a).hunger).toBe(1);
//   expect(game.getStateAt(b).hunger).toBe(0);
// });

// test("being in an area gives scavenge", () => {
//   const [a, b] = dateGen(60 * 1000);
//   const game = new Game({ lastSynced: a, currentLocation: locations.groceryStore });
//   expect(game.getStateAt(a).scavenge).toBe(0);
//   expect(game.getStateAt(b).scavenge).toBe(1);
// });


// test('eating food replinishes depleted hunger', () => {
//   const [a, b, c, d] = dateGen(1000);
//   const game = new Game({ lastSynced: a, hunger: 1 });
//   game.eat(c)

//   expect(game.getStateAt(a).hunger).toBe(1)
//   expect(game.getStateAt(b).hunger).toBe(0.99)
//   expect(game.getStateAt(c).hunger).toBe(1)
//   expect(game.getStateAt(d).hunger).toBe(0.99)
// })