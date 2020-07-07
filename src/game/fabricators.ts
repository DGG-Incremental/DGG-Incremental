import { chain, reduce, update } from "lodash"
import PriorityQueue = require('js-priority-queue')
import { findSourceMap } from "module"

export interface Fabricator<B> {
    blueprint: B
    start: Date | null
    finish: Date | null
}

export interface HasFabricators<B> {
    fabricatorSlots: (Fabricator<B> | null)[]
}

export interface FabricatorService<B, G extends HasFabricators<B>> {
    applyFabricator(game: G, fabricator: Fabricator<B>): G
    startFabricator(game: G, fabricator: Fabricator<B>): G
    getBlueprintCompletionTime(game: G, blueprint: B): Date | null
}

export const createFabricators = <B>() => {
    return {
        fabricatorSlots: new Array<Fabricator<B> | null>()
    } as HasFabricators<B>
}

export const getFabricators = <B, G extends HasFabricators<B>>(fabricators: G) => fabricators.fabricatorSlots

export const addFabricator = <B, G extends HasFabricators<B>>(fabricators: G) => {
    return {
        ...fabricators,
        fabricatorSlots: [...fabricators.fabricatorSlots, null]
    } as G
}

export const setFabricator = <B, G extends HasFabricators<B>>(fabricators: G, index: number, fabricator: Fabricator<B> | null) => {
    const updatedSlots = [...fabricators.fabricatorSlots]
    updatedSlots[index] = fabricator
    return {
        ...fabricators,
        fabricatorSlots: updatedSlots
    } as G
}


interface ApplyFabricatorsArgs<B, G extends HasFabricators<B>> {
    fabricators: G
    targetTime: Date
    fabricatorService: FabricatorService<B, G>
}
export const applyFabricators = <B, G extends HasFabricators<B>>({ fabricators, targetTime, fabricatorService }: ApplyFabricatorsArgs<B, G>) => {
    if (fabricators.fabricatorSlots.length === 0) {
        return fabricators
    }

    return chain(fabricators.fabricatorSlots)
        .compact()
        .filter(fabricator => fabricator.start !== null)
        .filter(fabricator => fabricator.finish !== null && fabricator.finish <= targetTime)
        .orderBy(fabricator => fabricator.finish)
        .reduce((acc, fabricator) => fabricatorService.applyFabricator(acc, fabricator), fabricators)
        .value() as G
}


