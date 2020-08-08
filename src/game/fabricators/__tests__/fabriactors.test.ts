import { createGame } from "../../game"
import { getFabricatorSize, addFabricator, getFabricatorDetails, setFabricator, startFabricator } from '../fabricators'
import { compose, pipe, always } from "ramda"
import { dateGen } from '../../__tests__/helpers'

describe("fabricators", () => {
    let game = createGame()

    beforeEach(() => game = createGame())


    describe("game's init fabricators", () => {
        test('should be empty', () => {
            expect(getFabricatorSize(game)).toBe(0)
        })
    })

    describe('addFabricator', () => {
        test('should add increase fabricator size', () => {
            const result = addFabricator(game)
            expect(getFabricatorSize(result)).toEqual(1)
        })
    })

    describe('getFabricatorDetails', () => {
        test('should return inactive object when fab is inactive', () => {
            const result = pipe(
                addFabricator,
                getFabricatorDetails(0)
            )(game)
            expect(result).toEqual({
                status: 'inactive',
                blueprint: null,
                startTime: null,
                endTime: null
            })
        })
    })

    describe('setFabricator', () => {
        test('should set fabricator with waiting status', () => {

            const result = pipe(
                addFabricator,
                setFabricator(0, 'testBlueprint'),
                getFabricatorDetails(0)
            )(game)

            expect(result).toEqual({
                status: 'waiting',
                blueprint: 'testBlueprint',
                startTime: null,
                endTime: null
            })
        })
    })

    describe('startFabricator', () => {
        test('should change a fabricator status to "in progress"', () => {
            const [start, end] = dateGen()

            const result = pipe(
                addFabricator,
                setFabricator(0, 'testBlueprint'),
                startFabricator(0, start, end),
                getFabricatorDetails(0)
            )(game)

            expect(result).toEqual({
                status: 'pending',
                blueprint: 'testBlueprint',
                startTime: start,
                endTime: end
            })
        })
    })
})