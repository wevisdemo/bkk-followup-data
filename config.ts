export class Config {
  summaryDataSheets: {[key: string]: string};
  districtSheet: string;
  populationSheet: string;
  budgetFrameworkSheet: string;
  dashboardStaticSheet: string;


  constructor(path: string) {
    const raw = JSON.parse(Deno.readTextFileSync(path));
    this.summaryDataSheets = raw.summaryDataSheets;
    this.districtSheet = raw.districtSheet;
    this.populationSheet = raw.populationSheet;
    this.budgetFrameworkSheet = raw.budgetFrameworkSheet;
    this.dashboardStaticSheet = raw.dashboardStaticSheet;
  }
}