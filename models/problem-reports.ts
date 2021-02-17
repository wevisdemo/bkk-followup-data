export interface FloodReport {
	floodHotspots: {
		name: string;
		description: string;
	}[]; // [{ name: "ถนนรัชดาภิเษก", description: "บริเวณหน้าธนาคารกรุงเทพ" }]
	meanFloodLevel: number | null;
	meanFloodLevelMaximumPoint: {
		year: number;
		districtId: number;
		districtName: string;
		value: number;
	};
}

// deno-lint-ignore no-empty-interface
export interface WasteReport {}

export interface GreenReport {
	publicGreenSpacePerCapita: number | null;
}

// deno-lint-ignore no-empty-interface
export interface WaterReport {}

export interface AirReport {
	sampling: {
		count: number;
		aboveThresholdCount: number;
	} | null;
}