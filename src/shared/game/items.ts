export interface Resource {
  name: string;
  shortname: string;
  icon: string;
}

export enum ResourceType {
  metal = "metal",
}

export const Items: { [key in ResourceType]: Resource } = {
  [ResourceType.metal]: {
    name: "metal",
    shortname: "MTL",
    icon: "",
  },
};
