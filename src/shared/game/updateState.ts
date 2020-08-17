import { Game } from "./types";
import { curry, pipe, filter, isNil, prop, compose, eqProps, propEq, identity, reject, partition, adjust, times, identical, addIndex, map, reduce, __, sortBy, head, invoker, call, defaultTo, converge, concat, juxt, or, propSatisfies, always, tap, lte } from "ramda";
import * as Actions from './actions'
import * as Fabricators from './fabricators'
import * as Mutators from "./mutators";
import calcBlueprintTimes from "./fabricators/calcBlueprintTimes";
import { FabricatorDetails } from "./fabricators";


interface ProgressionEvent {
    apply: () => Game,
    timestamp: Date
}

const getNextActionEvent = (game: Game): ProgressionEvent | undefined => {
    const [action, g] = Actions.dequeueAction(game)
    if (!action) {
        return undefined
    }
    const { type, timestamp } = action

    return {
        apply: () => Mutators.mutateGame(type, g),
        timestamp
    }
}


const getNextFabricatorEvent = curry((current: Date, game: Game): ProgressionEvent | undefined => pipe<any, any, any, any, any, any>(
    Fabricators.getAllFabricatorDetails,
    addIndex<any, any>(map)((fabricator: FabricatorDetails, index) => {
        const { blueprint } = fabricator
        if (!blueprint) {
            return undefined
        }

        //TODO clean up this mess
        const statusIs = (status: string) => propEq('status', status, fabricator)
        if (statusIs('waiting')) {
            const { start, end } = calcBlueprintTimes(blueprint, current, game)
            if (start && end) {
                return {
                    timestamp: current,
                    apply: () => Fabricators.startFabricator(index, start, end, game)
                }
            }
        }
        if (statusIs('pending')) {
            return {
                timestamp: fabricator.endTime,
                apply: () => pipe<Game, Game, Game>(Fabricators.stopFabricator(index), Mutators.mutateGame(blueprint))(game)
            }
        }

        return undefined
    }),
    reject(isNil),
    sortBy(prop('timestamp')),
    head
)(game))

const findNextEvent = (maxTimestamp: Date, events: Array<ProgressionEvent | undefined>) => pipe(
    (events: Array<ProgressionEvent | undefined>) => reject(isNil, events) as ProgressionEvent[],
    filter((event: ProgressionEvent) => event.timestamp <= maxTimestamp),
    (event) => sortBy(prop('timestamp'), event),
    head
)(events) as ProgressionEvent | undefined

export const progressState = curry((start: Date, end: Date, game: Game): Game => {
    const events = [
        getNextFabricatorEvent(start, game),
        getNextActionEvent(game),
    ]

    const nextEvent = findNextEvent(end, events)

    if (nextEvent) {
        return progressState(nextEvent.timestamp, end, nextEvent.apply())
    }
    return game
})
