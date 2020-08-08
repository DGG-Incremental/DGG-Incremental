import { Blueprint, Game } from "../types"
import * as R from 'ramda'
import * as Resources from '../resource'
import * as DateFns from 'date-fns'

export interface BlueprintTimes {
    start: Date | undefined
    end: Date | undefined
}

const UnknownBlueprintTimes: BlueprintTimes = {
    start: undefined,
    end: undefined
}

const startTimeCalculators = {
    craftWire: (start: Date, game: Game) => {
        return Resources.getResource('metal', game) >= 2 ?
            { start, end: DateFns.addSeconds(start, 2) } :
            UnknownBlueprintTimes
    }
}

const calcBlueprintTimes = R.curry((blueprint: Blueprint, start: Date, game: Game): BlueprintTimes => {
    return startTimeCalculators[blueprint](start, game)
})

export default calcBlueprintTimes