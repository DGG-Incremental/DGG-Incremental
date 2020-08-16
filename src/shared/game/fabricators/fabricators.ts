import { identity, set, lensProp, append, curry, pipe, update, assoc, assocPath, __, times, map } from "ramda";
import { Game, Fabricator } from "../types";

const EMPTY_FABRICATOR: Fabricator = {
    blueprint: null,
    endTime: null,
    startTime: null
}

const setGameFabricators = set(lensProp('fabricators'))
export const getFabricatorSize = (game: Game) => {
    if (!game || !game.fabricators) {
        debugger
    }
    return game.fabricators.length
}
export const addFabricator = (game: Game) => setGameFabricators(append(EMPTY_FABRICATOR, game.fabricators), game)



const getFabricatorStatus = (fabrcitaor: Fabricator) => {
    if (!fabrcitaor.blueprint) {
        return 'inactive'
    }
    else if (!fabrcitaor.startTime) {
        return 'waiting'
    }
    else {
        return 'pending'
    }
}

export const setFabricator = curry((fabricicatorIndex: number, blueprint: string, game: Game) => {
    const fabricators = update(fabricicatorIndex, { blueprint, startTime: null, endTime: null } as Fabricator, game.fabricators)
    return setGameFabricators(fabricators, game)
})

export interface FabricatorDetails extends Fabricator {
    status: 'inactive' | 'waiting' | 'pending'
}

export const getFabricatorDetails = curry((fabricatorIndex: number, game: Game) => {
    const fabricator = game.fabricators[fabricatorIndex]
    return assoc('status', getFabricatorStatus(fabricator), fabricator) as FabricatorDetails
})

export const startFabricator = curry((fabricatorIndex: number, startTime: Date, endTime: Date, game: Game) => {
    const setStartTime = assocPath(['fabricators', fabricatorIndex, 'startTime'], startTime)
    const setEndTime = assocPath(['fabricators', fabricatorIndex, 'endTime'], endTime)
    return pipe(setStartTime, setEndTime)(game)
})

export const stopFabricator = curry((fabricatorIndex: number, game: Game) => {
    const setStartTime = assocPath(['fabricators', fabricatorIndex, 'startTime'], undefined)
    const setEndTime = assocPath(['fabricators', fabricatorIndex, 'endTime'], undefined)
    return pipe(setStartTime, setEndTime)(game)
})

export const getAllFabricatorDetails = (game: Game) => pipe<Game, number, number[], FabricatorDetails[]>(
    getFabricatorSize,
    times(identity),
    map(getFabricatorDetails(__, game))
)(game) as FabricatorDetails[]


