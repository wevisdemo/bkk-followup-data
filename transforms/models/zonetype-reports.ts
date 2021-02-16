// deno-lint-ignore no-empty-interface
export interface AllReport extends DistrictAreaReport {}

export interface DistrictAreaReport {
	benchmarks: DistrictAreaBenchmark[]; // [ { zoneId: "all", areaName: "ทุกเขตในกรุงเทพมหานคร", value: 1.798 } ]
	rankings: {
		ranked: number;
		districtId: number;
		districtName: string;
		value: number;
	}[];
}

export interface SingleDistrictReport {
	ranked: number | null;
	rankings: {
		ranked: number;
		year: number;
		value: number | null;
	}[];
}

export interface DistrictAreaBenchmark {
	zoneId: 'all' | 'residence' | 'suburban' | 'tourism-and-cultural' | 'business';
	areaName: string;
	value: number | null;
}