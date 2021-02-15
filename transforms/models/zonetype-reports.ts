// deno-lint-ignore no-empty-interface
export interface AllReport extends DistrictAreaReport {}

export interface DistrictAreaReport {
	benchmarks: {
		zoneId: number | 'all';
		areaName: string;
		value: number;
	}[]; // [ { zoneId: "all", areaName: "ทุกเขตในกรุงเทพมหานคร", value: 1.798 } ]
	rankings: {
		ranked: number;
		districtId: number;
		districtName: string;
		value: number;
	}[];
}

export interface SingleDistrictReport {
	ranked: number;
	rankings: {
		ranked: number;
		year: number;
		value: number;
	}[];
}