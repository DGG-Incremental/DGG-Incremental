import * as Fabricators from '../fabricators'
import { dateGen } from '../../__tests__/helpers'

describe( "fabricators", () => {
    // const [BEFORE_COMPLETE, COMPLETE, AFTER_COMPLETE] = dateGen()

    // Timeline of fab events
    const [START, A_COMPLETES, BEFORE_B_COMPLETES, B_COMPLETES, A_COMPLETES_AGAIN, FINISH] = dateGen( 10 )
    type TestBlueprint = 'A' | 'B' | 'C'
    type TestFabricator = Fabricators.AbstractFabricator<TestBlueprint>

    const FABRICATOR_A: TestFabricator = {
        blueprint: 'A',
        start: START,
        finish: A_COMPLETES
    }

    const FABRICATOR_B: TestFabricator = {
        blueprint: 'B',
        start: START,
        finish: B_COMPLETES
    }

    const FABRICATOR_C: TestFabricator = {
        blueprint: 'C',
        start: null,
        finish: null
    }



    interface FabricatorGame extends Fabricators.AbstractFabricators<TestBlueprint> {
        counter: number
        completedOrder: TestBlueprint[]
        startedOrder: TestBlueprint[]
    }

    const createFabricatorGame = () => {
        return {
            ...Fabricators.createFabricators(),
            counter: 0,
            completedOrder: [],
            startedOrder: []
        } as FabricatorGame
    }

    let fabricators = createFabricatorGame()
    beforeEach( () => {
        fabricators = createFabricatorGame()
    } )


    const fabricatorService: Fabricators.FabricatorService<TestBlueprint, FabricatorGame> = {
        applyFabricator: ( game, fabricator ) => {
            const updatedGame = {
                ...game,
                counter: game.counter + 1,
                completedOrder: [...game.completedOrder, fabricator!.blueprint],
            } as FabricatorGame
            return updatedGame
        },
        getBlueprintCompletionTime: ( game, blueprint ) => {
            return {
                A: () => [A_COMPLETES, A_COMPLETES_AGAIN, null][game.completedOrder.filter( c => c === 'A' ).length],
                B: () => [B_COMPLETES, null][game.completedOrder.filter( c => c === 'B' ).length],
                C: () => null
            }[blueprint]()
        },
        startFabricator: ( game, fabricator ) => {
            return {
                ...game,
                startedOrder: [...game.startedOrder, fabricator.blueprint]
            }
        }
    }
    describe( "createFabricators", () => {
        test( "should start with no fabricator slots", () => {
            expect( Fabricators.getFabricators( fabricators ) ).toEqual( [] )
        } )
    } )

    describe( "addFabricator", () => {
        test( "should add null fabricator", () => {
            const updatedFabricators = Fabricators.addFabricator( fabricators )
            expect( Fabricators.getFabricators( updatedFabricators ) ).toEqual( [null] )
        } )

        test( 'should add multiple null fabricators', () => {
            let updated = Fabricators.addFabricator( fabricators )
            updated = Fabricators.addFabricator( updated )
            expect( Fabricators.getFabricators( updated ) ).toEqual( [null, null] )
        } )
    } )

    describe( 'setFabricator', () => {
        const buildBlankFabricator = () => {
            return Fabricators.addFabricator( fabricators )
        }
        let blankFabricator = buildBlankFabricator()

        beforeEach( () => blankFabricator = buildBlankFabricator() )

        test( 'should remove a fabricator', () => {
            let updated = Fabricators.setFabricator( blankFabricator, 0, null )
            expect( Fabricators.getFabricators( updated ) ).toEqual( [null] )
        } )

        test( 'should set a fabricator', () => {
            let updated = Fabricators.setFabricator( blankFabricator, 0, FABRICATOR_A )
            expect( Fabricators.getFabricators( updated ) ).toEqual( [FABRICATOR_A] )
        } )
    } )

    describe( 'applyFabricators', () => {
        test( 'should do nothing when no fabricators', () => {
            const result = Fabricators.applyFabricators( { fabricators, fabricatorService, targetTime: FINISH } )
            expect( result.counter ).toEqual( 0 )
        } )
        test( 'should apply fabricator when it is completed', () => {
            const updatedFabricators = Fabricators.setFabricator( fabricators, 0, FABRICATOR_A )
            const result = Fabricators.applyFabricators( { fabricators: updatedFabricators, fabricatorService, targetTime: A_COMPLETES } )
            expect( result.counter ).toEqual( 1 )
        } )
        test( 'should not apply fabricator when it is stalled', () => {
            const updatedFabricators = Fabricators.setFabricator( fabricators, 0, FABRICATOR_C )
            const result = Fabricators.applyFabricators( { fabricators: updatedFabricators, fabricatorService, targetTime: FINISH } )
            expect( result.counter ).toEqual( 0 )
        } )
        test( 'should not apply fabricator when it is still in progress', () => {
            const updatedFabricators = Fabricators.setFabricator( fabricators, 0, FABRICATOR_B )
            const result = Fabricators.applyFabricators( { fabricators: updatedFabricators, fabricatorService, targetTime: BEFORE_B_COMPLETES } )
            expect( result.counter ).toEqual( 0 )
        } )

        test( 'should apply fabricator after it has completed', () => {
            const updatedFabricators = Fabricators.setFabricator( fabricators, 0, FABRICATOR_B )
            const result = Fabricators.applyFabricators( { fabricators: updatedFabricators, fabricatorService, targetTime: B_COMPLETES } )
            expect( result.counter ).toEqual( 1 )
        } )

        test( 'should apply multiple fabricators', () => {
            let updatedFabricators = Fabricators.setFabricator( fabricators, 0, FABRICATOR_A )
            updatedFabricators = Fabricators.addFabricator( updatedFabricators )
            updatedFabricators = Fabricators.setFabricator( updatedFabricators, 1, FABRICATOR_B )
            const result = Fabricators.applyFabricators( { fabricators: updatedFabricators, fabricatorService, targetTime: B_COMPLETES } )
            expect( result.counter ).toEqual( 2 )
        } )

        test( 'should apply multiple fabricators in order of their completed time', () => {
            let updatedFabricators = Fabricators.setFabricator( fabricators, 0, FABRICATOR_B )
            updatedFabricators = Fabricators.addFabricator( updatedFabricators )
            updatedFabricators = Fabricators.setFabricator( updatedFabricators, 1, FABRICATOR_A )
            const result = Fabricators.applyFabricators( { fabricators: updatedFabricators, fabricatorService, targetTime: B_COMPLETES } )

            expect( result.counter ).toEqual( 2 )
            expect( result.completedOrder ).toEqual( [FABRICATOR_A.blueprint, FABRICATOR_B.blueprint] )
        } )

        test( 'should repeatidly apply fabricators', () => {
            const updatedFabricators = Fabricators.setFabricator( fabricators, 0, FABRICATOR_A )
            const result = Fabricators.applyFabricators( { fabricators: updatedFabricators, fabricatorService, targetTime: FINISH } )
            expect( fabricatorService.getBlueprintCompletionTime )
            expect( result.counter ).toEqual( 2 )
        } )
    } )
} )