import { YearRow } from '../extracts/year-row.ts';
import { District as ExtractedDistrict, DistrictAreaType } from '../extracts/district.ts';
import { ProblemType } from './problem-type.ts';
import { ReportBudgetable } from './report-budgetable.ts';

export class District extends ReportBudgetable {
  name: string;
  type: DistrictAreaType;
  publicGreenSpace: number;
  floodHotspot: {
    name: string;
		description: string;
  }[];
  mins: {[key in ProblemType]: { year: number, value: number } | null};
  maxes: {[key in ProblemType]: { year: number, value: number } | null};
  budgets: {[key in ProblemType | 'all']: { [key:number]: number }};
  latestYear: {[key in ProblemType]: number | null};

  constructor(
    public id: number,
    district: ExtractedDistrict,
    public years: { [key: number]: YearRow }
  ) {
    super();
    this.name = district.district;
    this.type = district.type;
    this.publicGreenSpace = district.publicGreenSpace;
    this.floodHotspot = district.floodHotspot;

    this.mins = this.generateMins();
    this.maxes = this.generateMaxes();
    this.budgets = this.generateBudgets();
    this.latestYear = this.generateLatestYear();
  }


  private generateMins(): {[key in ProblemType]: { year: number, value: number } | null} {
    return {
      [ProblemType.Flood]: this.getMinimumValue(ProblemType.Flood),
      [ProblemType.Waste]: this.getMinimumValue(ProblemType.Waste),
      [ProblemType.Green]: this.getMinimumValue(ProblemType.Green),
      [ProblemType.Water]: this.getMinimumValue(ProblemType.Water),
      [ProblemType.Air]: this.getMinimumValue(ProblemType.Air),
    };
  }

  private generateMaxes(): {[key in ProblemType]: { year: number, value: number } | null} {
    return {
      [ProblemType.Flood]: this.getMaximumValue(ProblemType.Flood),
      [ProblemType.Waste]: this.getMaximumValue(ProblemType.Waste),
      [ProblemType.Green]: this.getMaximumValue(ProblemType.Green),
      [ProblemType.Water]: this.getMaximumValue(ProblemType.Water),
      [ProblemType.Air]: this.getMaximumValue(ProblemType.Air),
    };
  }

  private generateBudgets(): {[key in ProblemType | 'all']: { [key:number]: number }} {
    return {
      'all': this.getProblemBudgets('all'),
      [ProblemType.Flood]: this.getProblemBudgets(ProblemType.Flood),
      [ProblemType.Waste]: this.getProblemBudgets(ProblemType.Waste),
      [ProblemType.Green]: this.getProblemBudgets(ProblemType.Green),
      [ProblemType.Water]: this.getProblemBudgets(ProblemType.Water),
      [ProblemType.Air]: this.getProblemBudgets(ProblemType.Air),
    };
  }

  private generateLatestYear(): {[key in ProblemType]: number | null} {
    const theYear = this.getLatestYear();

    return {
      [ProblemType.Flood]: this.valueOfYear(theYear, ProblemType.Flood),
      [ProblemType.Waste]: this.valueOfYear(theYear, ProblemType.Waste),
      [ProblemType.Green]: this.valueOfYear(theYear, ProblemType.Green),
      [ProblemType.Water]: this.valueOfYear(theYear, ProblemType.Water),
      [ProblemType.Air]: this.valueOfYear(theYear, ProblemType.Air),
    };
  }

  private getMinimumValue(problem: ProblemType): { year: number, value: number } | null {
    let min = Number.MAX_VALUE;
    let minYear = 0;
    for (const year in this.years) {
      const value = this.valueOfRow(this.years[year], problem);
      if (value === null) continue;
      if (value < min) {
        min = value;
        minYear = parseInt(year);
      }
    }

    if (min === Number.MAX_VALUE) return null;
    return { value: min, year: minYear };
  }

  private getMaximumValue(problem: ProblemType): { year: number, value: number } | null {
    let max = Number.MIN_VALUE;
    let maxYear = 0;
    for (const year in this.years) {
      const value = this.valueOfRow(this.years[year], problem);
      if (value === null) continue;
      if (value > max) {
        max = value;
        maxYear = parseInt(year);
      }
    }
    if (max === Number.MIN_VALUE) return null;
    return { value: max, year: maxYear };
  }

  getProblemBudgets(problem: ProblemType | 'all'): { [key:number]: number } {
    const budgets: { [key:number]: number } = {};
    for (const year in this.years) {
      const budget = this.budgetOfRow(this.years[year], problem);
      if (budget === null) continue;
      budgets[parseInt(year)] = budget;
    }
    return budgets;
  }

  valueOfYear(year: number, problem: ProblemType): number | null {
    return this.valueOfRow(this.years[year], problem);
  }

  valueOfRow(year: YearRow, problem: ProblemType): number | null {
    switch (problem) {
      case ProblemType.Flood:
        return year.floodData1;
      case ProblemType.Waste:
        return year.wasteData;
      case ProblemType.Green:
        return year.greenData;
      case ProblemType.Water:
        return year.waterData;
      case ProblemType.Air:
        return year.airData;
    }
  }

  budgetOfRow(year: YearRow, problem: ProblemType | 'all'): number | null {
    switch (problem) {
      case ProblemType.Flood:
        return year.floodBudget;
      case ProblemType.Waste:
        return year.wasteBudget;
      case ProblemType.Green:
        return year.greenBudget;
      case ProblemType.Water:
        return year.waterBudget;
      case ProblemType.Air:
        return year.airBudget;
      case 'all':
        return year.budgetTotal;
    }
  }
  
  getRankings(problem: ProblemType): {
		ranked: number;
		year: number;
		value: number | null;
	}[] {
    const rankings: { year: number, value: number | null}[] = [];
    for (const year in this.years) {
      rankings.push({
        year: parseInt(year),
        value: this.valueOfYear(parseInt(year), problem),
      });
    }
    return rankings
      .sort((a, b) => (a.value || 0) - (b.value || 0))
      .map((r, i) => ({
        ranked: i + 1,
        year: r.year,
        value: r.value,
      }));
  }

  getLatestYear(): number {
    const allYears = Object.keys(this.years);
    return parseInt(
      allYears
        .sort((a, b) => parseInt(a) - parseInt(b))
        [allYears.length - 1]
    );
  }
}