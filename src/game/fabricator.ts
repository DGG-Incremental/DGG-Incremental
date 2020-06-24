import { GameState, Game } from './game'
import _ from 'lodash'
import produce from 'immer'

export enum Blueprint {
    wire
}

export interface Fabricator {
    blueprint: Blueprint,

    // Fuzzy
    progress: number | null
}


interface BlueprintDetail {
    // how long does it take for fab to produce blueprint
    baseSpeed: number,
    production: string,
    cost: string,
    handler: (state: GameState) => void,
    getReadyTime: (state: GameState, fabricator: Fabricator, start: Date) => Date | null
}
const blueprintDetails: { [key in Blueprint]: BlueprintDetail } = {
    [Blueprint.wire]: {
        baseSpeed: 10 * 1000,
        production: '1 wire',
        cost: '3 metal',
        handler(state) {
            state.resources.wire = state.resources.wire + 1
            state.resources.metal = state.resources.metal - 3
        },
        getReadyTime(state, fabricator, start) {
            if (state.resources.metal >= 3) {
                return start
            }
            return null
        }
    }
}



const getCompletionTime = (fabricator: Fabricator, start: Date) => {
    const { baseSpeed } = blueprintDetails[fabricator.blueprint]
    return new Date(baseSpeed * (1 - fabricator.progress) + start.getTime())
}

const getFabricatorReadyTime = (state: GameState, fabricator: Fabricator, start: Date) => {
    return blueprintDetails[fabricator.blueprint].getReadyTime(state, fabricator, start)
}


interface FabricationQueueItem {
    event: 'start' | 'complete'
    fabricator: Fabricator
    time: Date | null
}


const completeFabricator = (fabricator: Fabricator, state: GameState, timestamp: Date): { state: GameState, event: FabricationQueueItem } => {
    const resultEvent: FabricationQueueItem = {
        event: 'start',
        fabricator,
        time: timestamp
    }
    return { state: produce(state, blueprintDetails[fabricator.blueprint].handler), event: resultEvent }
}

const fabriationSortCompare = (a: FabricationQueueItem, b: FabricationQueueItem) => {
    if (a.time === null) {
        return 1
    }
    else if (b.time === null) {
        return -1
    } else {
        return a.time.getTime() - b.time.getTime()
    }


}

const isQueueReady = (queue: FabricationQueueItem[], target: Date): boolean => {
    const [head] = queue
    return head && head.time !== null && head.time.getTime() <= target.getTime()
}

export const applyFabricators = (state: GameState, target: Date): GameState => {
    const { fabricators } = state
    const fabricationQueue: FabricationQueueItem[] = fabricators.map(fabricator => {
        if (fabricator.progress === null) {
            return {
                event: 'start',
                time: getFabricatorReadyTime(state, fabricator, state.lastSynced),
                fabricator
            } as FabricationQueueItem
        }
        else {
            return {
                event: 'complete',
                time: getCompletionTime(fabricator, state.lastSynced),
                fabricator
            } as FabricationQueueItem
        }
    })


    let currentState = state
    while (isQueueReady(fabricationQueue, target)) {
        fabricationQueue.sort(fabriationSortCompare)
        const current = fabricationQueue.shift()
        if (current.event === 'start') {
            const fabricator: Fabricator = { ...current.fabricator, progress: 0 }
            fabricationQueue.push({
                event: 'complete',
                fabricator,
                time: getCompletionTime(fabricator, current.time)
            } as FabricationQueueItem)
        } else {
            let { state: nextState, event } = completeFabricator(current.fabricator, currentState, current.time)
            currentState = nextState
            fabricationQueue.push(event)
        }
    }
    return currentState
}