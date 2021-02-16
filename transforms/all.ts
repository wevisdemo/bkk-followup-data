import { YearReport } from '../models/year-report.ts';
import { ProblemType } from '../models/problem-type.ts';
import { getAirSamplingCount } from './air.ts';
import { DistrictGroup } from './district-group.ts';
import { getFloodHotspots } from './flood.ts';
import { AirAllReport, FloodAllReport, GreenAllReport, WasteAllReport, WaterAllReport } from '../models/reports.ts';
import { DistrictAreaBenchmark } from '../models/zonetype-reports.ts';

export function getAlls(
  all: DistrictGroup,
  yearReports: YearReport[],
  latestYearReport: YearReport,
  benchmarks: {[key in ProblemType]: DistrictAreaBenchmark[] },
  ) {

  const floodAll: FloodAllReport = {
    value: latestYearReport.all.floodFrequency,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.floodFrequency; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Flood),
    maximumPoint: all.getMax(ProblemType.Flood),
    budgetPerYear: all.getReportBudgets(ProblemType.Flood),
    budgetOverall: all.getOverallReportBudget(ProblemType.Flood),
    rankings: all.getAllRankings(ProblemType.Flood),
    floodHotspots: getFloodHotspots(all),
    benchmarks: benchmarks[ProblemType.Flood],
    meanFloodLevel: latestYearReport.all.floodWaterLevel,
    meanFloodLevelMaximumPoint: all.getMin(ProblemType.Flood, yr => yr.floodWaterLevel),
  };

  const wasteAll: WasteAllReport = {
    value: latestYearReport.all.wasteData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.wasteData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Waste),
    maximumPoint: all.getMax(ProblemType.Waste),
    budgetPerYear: all.getReportBudgets(ProblemType.Waste),
    budgetOverall: all.getOverallReportBudget(ProblemType.Waste),
    rankings: all.getAllRankings(ProblemType.Waste),
    benchmarks: benchmarks[ProblemType.Waste],
  };

  const greenAll: GreenAllReport = {
    value: latestYearReport.all.greenData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.greenData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Green),
    maximumPoint: all.getMax(ProblemType.Green),
    budgetPerYear: all.getReportBudgets(ProblemType.Green),
    budgetOverall: all.getOverallReportBudget(ProblemType.Green),
    rankings: all.getAllRankings(ProblemType.Green),
    benchmarks: benchmarks[ProblemType.Green],
    publicGreenSpacePerCapita: null,
  };

  const waterAll: WaterAllReport = {
    value: latestYearReport.all.waterData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.waterData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Water),
    maximumPoint: all.getMax(ProblemType.Water),
    budgetPerYear: all.getReportBudgets(ProblemType.Water),
    budgetOverall: all.getOverallReportBudget(ProblemType.Water),
    rankings: all.getAllRankings(ProblemType.Water),
    benchmarks: benchmarks[ProblemType.Water],
  };

  const airAll: AirAllReport = {
    value: latestYearReport.all.airData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.airData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Air),
    maximumPoint: all.getMax(ProblemType.Air),
    budgetPerYear: all.getReportBudgets(ProblemType.Air),
    budgetOverall: all.getOverallReportBudget(ProblemType.Air),
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