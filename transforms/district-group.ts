import { YearRow } from '../extracts/year-row.ts';
import { District } from './district.ts';
import { ProblemType } from './problem-type.ts';
import { ReportBudgetable } from './report-budgetable.ts';

export class DistrictGroup extends ReportBudgetable {
  constructor(
    public readonly districts: District[],
  ) {
    super();
  }

  getMin(problem: ProblemType): {
    districtId: number,
    districtName: string,
    year: number,
    value: number,
  } | null {
    let minDistrict = this.districts[0];
    let min = this.districts[0].getMinimumValue(problem);

    for (const district of this.districts) {
      const localMin = district.getMinimumValue(problem);
      if (localMin === null) continue;
      if (min === null || localMin.value < min.value) {
        minDistrict = district;
        min = localMin;
      }
    }

    if (!min) return null;

    return {
      districtId: minDistrict.id,
      districtName: minDistrict.name,
      year: min.year,
      value: min.value,
    };
  }

  getMax(problem: ProblemType): {
    districtId: number,
    districtName: string,
    year: number,
    value: number,
  } | null {
    let maxDistrict = this.districts[0];
    let max = this.districts[0].getMaximumValue(problem);

    for (const district of this.districts) {
      const localMax = district.getMaximumValue(problem);
      if (!localMax) continue;
      if (max === null || localMax.value > max.value) {
        maxDistrict = district;
        max = localMax;
      }
    }

    if (!max) return null;

    return {
      districtId: maxDistrict.id,
      districtName: maxDistrict.name,
      year: max.year,
      value: max.value,
    };
  }

  getProblemBudgets(problem: ProblemType | 'all'): {[key:number]: number} {
    const budgets: {[key:number]: number} = {};
    for (const district of this.districts) {
      const eachDistrict = district.budgets[problem];
      for (const year in eachDistrict) {
        if (!budgets[year]) {
          budgets[year] = 0;
        }
        budgets[year] += eachDistrict[year];
      }
    }
    return budgets;
  }

  getAllRankings(problem: ProblemType, rankedByValueGetter?: (yr: YearRow) => number | null): {
    ranked: number;
    districtId: number;
    districtName: string;
    value: number;
  }[] {

    if (!rankedByValueGetter) {
      rankedByValueGetter = (yr: YearRow) => District.valueOfRow(yr, problem);
    }

    const sorted = this.districts
      .filter(d => rankedByValueGetter!(d.latestYear) !== null)
      .sort((a, b) => 
        (rankedByValueGetter!(a.latestYear) || 0)  - (rankedByValueGetter!(b.latestYear) || 0)
      );
  
    return sorted.map((d, i) => ({
      ranked: i + 1,
      districtId: d.id,
      districtName: d.name,
      value: rankedByValueGetter!(d.latestYear)!,
    }));
  }
}