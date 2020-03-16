import { GameState } from "./game"

export interface GameLocation {
  name: string
  info: string
  description: string
}

const factory: GameLocation = {
  name: "Factory",
  info: "Rusted metal and tetanus",
  description:
    "The rusted carcases of old machines huddle around the concrete floor.",
}

const apartment: GameLocation = {
  name: "Apartment Complex",
  info: "Dirty clothing scraps and faded memories",
  description: "",
}

const groceryStore: GameLocation = {
  name: "Grocery Store",
  info: "",
  description: ""
}

export const locations = {
  factory,
  apartment,
  groceryStore
}