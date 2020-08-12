import { createGame } from "../../game"
import calcBlueprintTimes, { BlueprintTimes } from '../calcBlueprintTimes'
import { Blueprint, Game } from "../../types"
import { dateGen } from "../../__tests__/helpers"
import * as Resources from '../../resource'

describe('calcBlueprintTimes', () => {
    const [a] = dateGen()
    let game = createGame()
    beforeEach(() => game = createGame())

    const testBlueprint = (blueprint: Blueprint, name: string, game: Game, start: Date | undefined, end: Date | undefined) => {
        test(name, () => {
            const result = calcBlueprintTimes(blueprint, a, game)
            expect(result).toEqual({ start, end })
        })
    }

    testBlueprint(
        'craftWire',
        'should return undefined start/finish when no fabricators',
        game,
        undefined,
        undefined
    )

    testBlueprint(
        'craftWire',
        'should return start = a and end = a + 2 secs when metal available',
        Resources.setResource('metal', 2, game),
        a,
        new Date(a.getTime() + 2 * 1000) 
    )
})