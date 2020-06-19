export interface Resource {
  name: string;
  shortname: string;
  icon: string;
}

export enum ResourceType {
  metal = "metal",
  wire = "wire"
}

export const Items: { [key in ResourceType]: Resource } = {
  [ResourceType.metal]: {
    name: "metal",
    shortname: "MTL",
    icon: "",
  },
  [ResourceType.wire]: {
    name: "wire",
    shortname: 'WR',
    icon: ''
  }
};
