import { YearReport } from '../models/year-report.ts';
import { ProblemType } from '../models/problem-type.ts';
import { getAirSamplingCount } from './air.ts';
import { DistrictGroup } from './district-group.ts';
import { getFloodHotspots } from './flood.ts';
import { AirAllReport, FloodAllReport, GreenAllReport, WasteAllReport, WaterAllReport } from '../models/reports.ts';
import { DistrictAreaBenchmark } from '../models/zonetype-reports.ts';
import { ReportBudgetable } from './report-budgetable.ts';
import { YearRow } from '../models/year-row.ts';

export function getAlls(
  all: DistrictGroup,
  yearReports: YearReport[],
  latestYearReport: YearReport,
  benchmarks: {[key in ProblemType]: DistrictAreaBenchmark[] },
  ) {

  const allBudget = new AllBudget(yearReports
    .reduce((prev, next) => {
      prev[next.year] = next.all;
      return prev;
    }, {} as {[key:number]: YearRow })
  );

  const floodAll: FloodAllReport = {
    value: latestYearReport.all.floodFrequency,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.floodFrequency; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Flood),
    maximumPoint: all.getMax(ProblemType.Flood),
    budgetPerYear: allBudget.getReportBudgets(ProblemType.Flood),
    budgetOverall: allBudget.getOverallReportBudget(ProblemType.Flood),
    rankings: all.getAllRankings(ProblemType.Flood),
    floodHotspots: getFloodHotspots(all),
    benchmarks: benchmarks[ProblemType.Flood],
    meanFloodLevel: latestYearReport.all.floodWaterLevel,
    meanFloodLevelMaximumPoint: all.getMax(ProblemType.Flood, yr => yr.floodWaterLevel),
  };

  const wasteAll: WasteAllReport = {
    value: latestYearReport.all.wasteData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.wasteData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Waste),
    maximumPoint: all.getMax(ProblemType.Waste),
    budgetPerYear: allBudget.getReportBudgets(ProblemType.Waste),
    budgetOverall: allBudget.getOverallReportBudget(ProblemType.Waste),
    rankings: all.getAllRankings(ProblemType.Waste),
    benchmarks: benchmarks[ProblemType.Waste],
  };

  const greenAll: GreenAllReport = {
    value: latestYearReport.all.greenData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.greenData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Green),
    maximumPoint: all.getMax(ProblemType.Green),
    budgetPerYear: allBudget.getReportBudgets(ProblemType.Green),
    budgetOverall: allBudget.getOverallReportBudget(ProblemType.Green),
    rankings: all.getAllRankings(ProblemType.Green),
    benchmarks: benchmarks[ProblemType.Green],
    publicGreenSpacePerCapita: null,
  };

  const waterAll: WaterAllReport = {
    value: latestYearReport.all.waterData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.waterData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Water),
    maximumPoint: all.getMax(ProblemType.Water),
    budgetPerYear: allBudget.getReportBudgets(ProblemType.Water),
    budgetOverall: allBudget.getOverallReportBudget(ProblemType.Water),
    rankings: all.getAllRankings(ProblemType.Water),
    benchmarks: benchmarks[ProblemType.Water],
  };

  const airAll: AirAllReport = {
    value: latestYearReport.all.airData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.airData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Air),
    maximumPoint: all.getMax(ProblemType.Air),
    budgetPerYear: allBudget.getReportBudgets(ProblemType.Air),
    budgetOverall: allBudget.getOverallReportBudget(ProblemType.Air),
    rankings: all.getAllRankings(ProblemType.Air),
    benchmarks: benchmarks[ProblemType.Air],
    sampling: getAirSamplingCount(all),
  };

  return {
    [ProblemType.Flood]: floodAll,
    [ProblemType.Waste]: wasteAll,
    [ProblemType.Green]: greenAll,
    [ProblemType.Water]: waterAll,
    [ProblemType.Air]: airAll,
  };
}

class AllBudget extends ReportBudgetable {
  constructor(
    private yearRows: { [key: number]: YearRow },
  ) {
    super();
  }
  
  getProblemBudgets(problem: ProblemType | 'all'): { [key: number]: number | null; } {
    const budgets: { [key: number]: number | null; } = {};
    for (const year in this.yearRows) {
      budgets[year] = this.yearRows[year].getBudget(problem);
    }

    return budgets;
  }
}