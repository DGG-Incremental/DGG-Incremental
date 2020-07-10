import WireIcon from "../client/assets/images/icons/resources/wire.svg";
import HeavyWireIcon from "../client/assets/images/icons/resources/wire-heavy.svg";
import MetalIcon from "../client/assets/images/icons/resources/metal.svg";

export interface Resource {
	name: string;
	shortname: string;
	icon: string;
}

export enum ResourceType {
	metal = "metal",
	wire = "wire",
	heavyWire = "heavyWire",
}

export const Resources: { [key in ResourceType]: Resource } = {
	[ResourceType.metal]: {
		name: "Metal",
		shortname: "MTL",
		icon: MetalIcon,
	},
	[ResourceType.wire]: {
		name: "Wire",
		shortname: "WIR",
		icon: WireIcon,
	},
	[ResourceType.heavyWire]: {
		name: "Heavy Wire",
		shortname: "HWR",
		icon: HeavyWireIcon,
	},
};
