

export type Resource = 'metal' | 'wire'
export type Blueprint = 'craftWire'
export type SetFabricatorAction<B extends Blueprint> = {
    action: 'setFabricator',
    index: number,
    blueprint: B
}
export type ActionType = 'scavengeMetal' | 'craftWire' | 'makeFabricator' | SetFabricatorAction<'craftWire'>

export interface Action {
    type: ActionType
    timestamp: Date
}
export interface Fabricator {
    startTime: Date | null
    endTime: Date | null
    blueprint: Blueprint | null
}

export interface Game {
    resources: Record<Resource, number>
    actionQueue: Array<Action>
    fabricators: Array<Fabricator>
}

export const isResource = (s: string): s is Resource => ['metal', 'wire'].includes(s)