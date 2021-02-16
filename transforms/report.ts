
import { YearReport } from '../extracts/year-report.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';
import { District } from './district.ts';
import { YearRow } from '../models/year-row.ts';
import { AirAllReport, FloodAllReport, FloodDistrictAreaReport, GreenAllReport, ReportSuite, WasteAllReport, WaterAllReport } from './models/reports.ts';
import { ProblemType } from '../models/problem-type.ts';
import { DistrictGroup } from './district-group.ts';
import { getBenchmarks } from './benchmarks.ts';

const AIR_QUALITY_THRESHOLD = 1;

export function transformReports(
  yearReports: YearReport[],
  extractedDistricts: ExtractedDistrict[],
  ): ReportSuite {
  yearReports.sort((a, b) => a.year - b.year);
  const latestYearReport = yearReports[yearReports.length - 1];
  const districts = extractedDistricts.map((d, i) => getDistrict(yearReports, d, i));
  
  const all = new DistrictGroup(districts);
  const residence = new DistrictGroup(districts.filter(d => d.type === 'residence'));
  const suburban = new DistrictGroup(districts.filter(d => d.type === 'suburban'));
  const tourism = new DistrictGroup(districts.filter(d => d.type === 'tourism-and-cultural'));
  const business = new DistrictGroup(districts.filter(d => d.type === 'business'));

  const {
    floodBenchmarks,
    wasteBenchmarks,
    greenBenchmarks,
    waterBenchmarks,
    airBenchmarks,
  } = getBenchmarks(latestYearReport);

  const floodAll: FloodAllReport = {
    value: latestYearReport.all.floodFrequency,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.floodFrequency; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Flood),
    maximumPoint: all.getMax(ProblemType.Flood),
    budgetPerYear: all.getReportBudgets(ProblemType.Flood),
    budgetOverall: all.getOverallReportBudget(ProblemType.Flood),
    rankings: all.getAllRankings(ProblemType.Flood),
    floodHotspots: getFloodHotspots(all),
    benchmarks: floodBenchmarks,
    meanFloodLevel: latestYearReport.all.floodWaterLevel,
    meanFloodLevelMaximumPoint: all.getMin(ProblemType.Flood, yr => yr.floodWaterLevel),
  };

  const floodResidence: FloodDistrictAreaReport = {
    value: latestYearReport.districtGroups.find(g => g.district === 'residence')?.floodFrequency || null,
    valuePerYear: yearReports
      .reduce((prev, next) => { prev[next.year] = next.districtGroups.find(d => d.district === 'residence')?.floodFrequency || null; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: residence.getMin(ProblemType.Flood),
    maximumPoint: residence.getMax(ProblemType.Flood),
    budgetPerYear: residence.getReportBudgets(ProblemType.Flood),
    budgetOverall: residence.getOverallReportBudget(ProblemType.Flood),
    rankings: residence.getAllRankings(ProblemType.Flood),
    floodHotspots: getFloodHotspots(residence),
    benchmarks: floodBenchmarks,
    meanFloodLevel: latestYearReport.districtGroups.find(g => g.district === 'residence')?.floodWaterLevel || null,
    meanFloodLevelMaximumPoint: residence.getMin(ProblemType.Flood, yr => yr.floodWaterLevel),
  };

  const wasteAll: WasteAllReport = {
    value: latestYearReport.all.wasteData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.wasteData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Waste),
    maximumPoint: all.getMax(ProblemType.Waste),
    budgetPerYear: all.getReportBudgets(ProblemType.Waste),
    budgetOverall: all.getOverallReportBudget(ProblemType.Waste),
    rankings: all.getAllRankings(ProblemType.Waste),
    benchmarks: wasteBenchmarks,
  };

  const greenAll: GreenAllReport = {
    value: latestYearReport.all.greenData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.greenData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Green),
    maximumPoint: all.getMax(ProblemType.Green),
    budgetPerYear: all.getReportBudgets(ProblemType.Green),
    budgetOverall: all.getOverallReportBudget(ProblemType.Green),
    rankings: all.getAllRankings(ProblemType.Green),
    benchmarks: greenBenchmarks,
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
    benchmarks: waterBenchmarks,
  };

  const airAll: AirAllReport = {
    value: latestYearReport.all.airData,
    valuePerYear: yearReports.reduce((prev, next) => { prev[next.year] = next.all.airData; return prev; }, {} as { [key: number]: number | null } ),
    minimumPoint: all.getMin(ProblemType.Air),
    maximumPoint: all.getMax(ProblemType.Air),
    budgetPerYear: all.getReportBudgets(ProblemType.Air),
    budgetOverall: all.getOverallReportBudget(ProblemType.Air),
    rankings: all.getAllRankings(ProblemType.Air),
    benchmarks: airBenchmarks,
    sampling: getAirSamplingCount(all),
  };

  return {
    alls: {
      [ProblemType.Flood]: floodAll,
      [ProblemType.Waste]: wasteAll,
      [ProblemType.Green]: greenAll,
      [ProblemType.Water]: waterAll,
      [ProblemType.Air]: airAll,
    },
    districts: {
      residence: {
        [ProblemType.Flood]: floodResidence,
      }
    }
  } as ReportSuite;
}

function getDistrict(
  yearReports: YearReport[],
  extractedDistrict: ExtractedDistrict,
  id: number,
  ): District {
  const districts = yearReports
    .reduce((prev, next) => {
      const found = next.districts.find(d => d.district === extractedDistrict.district);
      if (found) prev[next.year] = found;
      return prev;
    }, {} as {[key:number]: YearRow});
  return new District(id, extractedDistrict, districts);
}

function getFloodHotspots(districtGroup: DistrictGroup): { name: string, description: string }[] {
  return districtGroup.districts.map(d => d.floodHotspot).filter(hs => hs).reduce((p, n) => p.concat(n), []);
}

function getAirSamplingCount(districtGroup: DistrictGroup): {
  count: number;
  aboveThresholdCount: number;
} {
  const samplings = districtGroup.districts.map(d => getAirSampling(d)).reduce((p, n) => p.concat(n), []);
  const aboves = samplings.filter(s => s > AIR_QUALITY_THRESHOLD);

  return {
    count: samplings.length,
    aboveThresholdCount: aboves.length,
  }
}

function getAirSampling(district: District): number[] {
  const airSampling = [];
  for (const year in district.years) {
    const value = district.years[parseInt(year)].getValueOf(ProblemType.Air);
    if (value !== null) airSampling.push(value);
  }
  return airSampling;
}