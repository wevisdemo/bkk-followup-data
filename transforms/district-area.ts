import { YearReport } from '../models/year-report.ts';
import { ProblemType } from '../models/problem-type.ts';
import { getAirSamplingCount } from './air.ts';
import { DistrictGroup } from './district-group.ts';
import { getFloodHotspots } from './flood.ts';
import { BaseReport } from '../models/base-report.ts';
import {
  AirDistrictAreaReport,
  FloodDistrictAreaReport,
  GreenDistrictAreaReport,
  WasteDistrictAreaReport,
  WaterDistrictAreaReport,
} from '../models/reports.ts';
import { DistrictAreaBenchmark, DistrictAreaReport } from '../models/zonetype-reports.ts';
import { DistrictAreaType } from '../models/district-area-type.ts';

export function getDistrictArea(
  group: DistrictGroup,
  area: DistrictAreaType,
  yearReports: YearReport[],
  latestYearReport: YearReport,
  benchmarks: {[key in ProblemType]: DistrictAreaBenchmark[] },
  ) {
  const flood: FloodDistrictAreaReport = {
    ...getReport(ProblemType.Flood, area, group, yearReports, latestYearReport, benchmarks),
    floodHotspots: getFloodHotspots(group),
    meanFloodLevel: latestYearReport.districtGroups.find(g => g.district === area)?.floodWaterLevel || null,
    meanFloodLevelMaximumPoint: group.getMax(ProblemType.Flood, yr => yr.floodWaterLevel),
  };

  const waste: WasteDistrictAreaReport = {
    ...getReport(ProblemType.Waste, area, group, yearReports, latestYearReport, benchmarks),
  };

  const green: GreenDistrictAreaReport = {
    ...getReport(ProblemType.Green, area, group, yearReports, latestYearReport, benchmarks),
    publicGreenSpacePerCapita: null,
  };

  const water: WaterDistrictAreaReport = {
    ...getReport(ProblemType.Water, area, group, yearReports, latestYearReport, benchmarks),
  };

  const air: AirDistrictAreaReport = {
    ...getReport(ProblemType.Air, area, group, yearReports, latestYearReport, benchmarks),
    sampling: getAirSamplingCount(group),
  };

  return {
    [ProblemType.Flood]: flood,
    [ProblemType.Waste]: waste,
    [ProblemType.Green]: green,
    [ProblemType.Water]: water,
    [ProblemType.Air]: air,
  }
}

function getReport(
  problem: ProblemType,
  area: DistrictAreaType,
  group: DistrictGroup,
  yearReports: YearReport[],
  latestYearReport: YearReport,
  benchmarks: {[key in ProblemType]: DistrictAreaBenchmark[] },
  ): GenericDistrictAreaReport {
  return {
    value: latestYearReport.districtGroups.find(g => g.district === area)?.getValueOf(problem) || null,
    valuePerYear: yearReports
      .reduce((prev, next) => { prev[next.year] = next.districtGroups.find(d => d.district === area)?.getValueOf(problem) || null; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: group.getMin(problem),
    maximumPoint: group.getMax(problem),
    budgetPerYear: group.getReportBudgets(problem),
    budgetOverall: group.getOverallReportBudget(problem),
    rankings: group.getAllRankings(problem),
    benchmarks: benchmarks[problem],
  }
}

interface GenericDistrictAreaReport extends DistrictAreaReport, BaseReport {}