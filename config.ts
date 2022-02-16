export class Config {
  summaryDataSheets: {[key: string]: string};
  districtSheet: string;

  constructor(path: string) {
    const raw = JSON.parse(Deno.readTextFileSync(path));
    this.summaryDataSheets = raw.summaryDataSheets;
    this.districtSheet = raw.districtSheet;
  }
}