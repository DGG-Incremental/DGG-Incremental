import { pipe, equals, cond, __, CurriedFunction2, curry, T, identity, propEq, props, apply } from "ramda";
import { addResource } from "./resource";
import { Blueprint, Game, ActionType, SetFabricatorAction } from "./types";
import * as Fabricator from "./fabricators";

type Mutation = Blueprint | ActionType
type Handler = CurriedFunction2<Mutation, Game, Game>


const scavengeMetal = addResource('metal', 1)
const craftWire = pipe(
    addResource('metal', -2),
    addResource('wire', 1)
)

const setFabricator = curry((mutation: Mutation, game: Game) => {
    const action = mutation as SetFabricatorAction<Blueprint>
    return Fabricator.setFabricator(action.index, action.blueprint, game)
})


const eq = (mutation: Mutation) => equals<Mutation>(mutation)

// For mutators that don't need the Mutation
const simple = curry((fn: (game: Game) => Game, _m: Mutation, game: Game) => fn(game))



const mutatorPairs: Array<[(mutation: Mutation) => boolean, CurriedFunction2<Mutation, Game, Game>]> = [
    [eq('scavengeMetal'), simple(scavengeMetal)],
    [eq('craftWire'), simple(craftWire)],
    [eq('makeFabricator'), simple(Fabricator.addFabricator)],
    [propEq('action', 'setFabricator'), setFabricator],
    [T, simple(identity)]
]


export const mutateGame = curry((mutation: Mutation, game: Game) => {
    return cond(mutatorPairs)(mutation, game)
})