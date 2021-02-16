export interface BaseReport {
	value: number;
	valuePerYear: {[key: number]: number}; // { "2555": 1.60 }
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
	all: number;
	focused: number;
}