

import { Game } from '../lib/game'
import { TaskHandlers, TaskType, Tasks } from '../lib/tasks'
import { dateGen } from './helpers'


// List of tests for metal tasks. First value is time span of test, the second is the expected 
// metal value
const metalTests = [
    [0.5 * 1000, 1],
    [1 * 1000, 2],
    [8 * 1000, 10],
    [10 * 1000, 10],
    [11 * 1000, 12],
    [19 * 1000, 20],
    [20 * 1000, 20],
    [21 * 1000, 22]
]
test('aquireMetal task produces metal', () => {
    const testTimespan = (span: number, expected: number) => {
        const { interval } = Tasks[TaskType.acquireMetal]
        const [a, b] = dateGen(span)

        const game = new Game({
            resources: { metal: 0 },
            tasks: [{
                startTime: a,
                task: TaskType.acquireMetal
            }]
        })

        const result = game.getStateAt(b)
        expect(result.resources.metal).toBe(expected)
    }

    metalTests.forEach(([span, expected]) => testTimespan(span, expected))
})