export interface BaseReport {
	value: number | null;
	valuePerYear: {[key: number]: number | null}; // { "2555": 1.60 }
	minimumPoint: {
		year: number;
		districtId: number;
		districtName: string;
		value: number;
	} | null;
	maximumPoint: {
		year: number;
		districtId: number;
		districtName: string;
		value: number;
	} | null;
	budgetPerYear: {[key: number]: ReportBudget}; // { "2555": { all: 10000000, focused: 50000 } }
	budgetOverall: ReportBudget,
}

export interface ReportBudget {
	all: number | null;
	focused: number | null;
}