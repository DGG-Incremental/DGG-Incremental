import { GameState } from "./resource"

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
  info: "Scraps of dirty clothing and faded memories",
  description: "",
}

const groceryStore: GameLocation = {
  name: "Grocery Store",
  info: "Tiny morsels and a lingering stench",
  description: ""
}

export const locations = {
  factory,
  apartment,
  groceryStore
}