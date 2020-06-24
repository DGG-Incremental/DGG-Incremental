import { Game } from '../'
import { Blueprint, applyFabricators } from '../fabricator'
import { dateGen } from './helpers'
import { GameState } from '../game'
import type { GameResources } from '../game'
import produce from 'immer'

interface TestFabricatorArgs {
    startState: GameState,
    timeSpan: number,
    expectedResources: Partial<GameResources>
}

const testFabricator = ({ startState, timeSpan, expectedResources }: TestFabricatorArgs) => {
    const [a, b] = dateGen(timeSpan)
    startState.lastSynced = a
    const result = applyFabricators(startState, b)
    const { resources } = result
    Object.entries(expectedResources).forEach(([name, count]) => {
        expect(resources[name]).toBe(count)
    })
}

test('Fabricator adds resources and removes resources', () => {
    const game = new Game({
        resources: {
            metal: 3,
            wire: 0
        },
        fabricators: [
            {
                blueprint: Blueprint.wire,
                progress: null
            }
        ]
    })
    testFabricator({
        startState: game.state,
        timeSpan: 10 * 1000,
        expectedResources: {
            metal: 0,
            wire: 1
        }
    })
})

test('2 Fabricators add resources and removes resources', () => {
    const game = new Game({
        resources: {
            metal: 6,
            wire: 0
        },
        fabricators: [
            {
                blueprint: Blueprint.wire,
                progress: null
            },
            {
                blueprint: Blueprint.wire,
                progress: null
            }
        ]
    })
    testFabricator({
        startState: game.state,
        timeSpan: 10 * 1000,
        expectedResources: {
            metal: 0,
            wire: 2
        }
    })
})