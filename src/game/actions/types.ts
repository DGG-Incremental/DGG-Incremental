
export enum GameAction {
  'scavengeMetal',
  'makeWire',
  'addFabricator',
  'setWireFabricator'
}

export type ActionHandler<G> = ( game: G, action: GameAction ) => G

export interface Action<A> {
  action: A;
  timestamp: Date
}



