export interface Item {
  name: string;
  shortname: string;
  icon: string;
}

export enum ItemType {
  metal = "metal",
}

export const Items: { [key in ItemType]: Item } = {
  [ItemType.metal]: {
    name: "metal",
    shortname: "MTL",
    icon: "",
  },
};
