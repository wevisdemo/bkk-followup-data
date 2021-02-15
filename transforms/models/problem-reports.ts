export interface FloodReport {
	floodHotspots: {
		name: string;
		description: string;
	}[]; // [{ name: "ถนนรัชดาภิเษก", description: "บริเวณหน้าธนาคารกรุงเทพ" }]
}

// deno-lint-ignore no-empty-interface
export interface WasteReport {}

export interface GreenReport {
	publicGreenSpacePerCapita: number;
}

// deno-lint-ignore no-empty-interface
export interface WaterReport {}

export interface AirReport {
	sampling: {
		count: number;
		aboveThresholdCount: number;
	};
}