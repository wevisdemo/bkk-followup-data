
import { YearReport } from '../extracts/year-report.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';
import { District } from './district.ts';
import { YearRow } from '../extracts/year-row.ts';
import { FloodAllReport, FloodDistrictAreaReport, ReportSuite } from './models/reports.ts';
import { ProblemType } from './problem-type.ts';
import { DistrictGroup } from './district-group.ts';

const AIR_QUALITY_THRESHOLD = 1;

export function transformReports(
  yearReports: YearReport[],
  extractedDistricts: ExtractedDistrict[],
  ): ReportSuite {
  const districts = extractedDistricts.map((d, i) => getDistrict(yearReports, d, i));
  
  const all = new DistrictGroup(districts);
  const business = new DistrictGroup(districts.filter(d => d.type === 'business'));
  const suburban = new DistrictGroup(districts.filter(d => d.type === 'suburban'));
  const residence = new DistrictGroup(districts.filter(d => d.type === 'residence'));
  const tourism = new DistrictGroup(districts.filter(d => d.type === 'tourism-and-cultural'));

  const floodAll: FloodAllReport = {
    value: 0,
    valuePerYear: {},
    minimumPoint: all.getMin(ProblemType.Flood),
    maximumPoint: all.getMax(ProblemType.Flood),
    budgetPerYear: all.getReportBudgets(ProblemType.Flood),
    budgetOverall: all.getOverallReportBudget(ProblemType.Flood),
    rankings: all.getAllRankings(ProblemType.Flood, yr => yr.floodData1),
    floodHotspots: getFloodHotspots(all),
    benchmarks: [],
    frequency: yearReports
      .map(r => r.all.floodData1)
      .reduce((prev, next) => (prev || 0) + (next || 0), 0) || 0,
  };

  const floodResidence: FloodDistrictAreaReport = {
    value: 0,
    valuePerYear: {},
    minimumPoint: residence.getMin(ProblemType.Flood),
    maximumPoint: residence.getMax(ProblemType.Flood),
    budgetPerYear: residence.getReportBudgets(ProblemType.Flood),
    budgetOverall: residence.getOverallReportBudget(ProblemType.Flood),
    rankings: residence.getAllRankings(ProblemType.Flood, yr => yr.floodData1),
    floodHotspots: getFloodHotspots(residence),
    benchmarks: [],
    frequency: yearReports
      .map(r => r.districtGroups.find(g => g.district === 'residence')?.floodData1)
      .reduce((prev, next) => (prev || 0) + (next || 0), 0) || 0,
  };

  return {
    alls: {
      [ProblemType.Flood]: floodAll,
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
    const value = district.valueOfYear(parseInt(year), ProblemType.Air);
    if (value) airSampling.push(value);
  }
  return airSampling;
}