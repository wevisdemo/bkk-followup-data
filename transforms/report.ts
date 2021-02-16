
import { YearReport } from '../extracts/year-report.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';
import { District } from './district.ts';
import { YearRow } from '../models/year-row.ts';
import { FloodDistrictAreaReport, ReportSuite } from './models/reports.ts';
import { ProblemType } from '../models/problem-type.ts';
import { DistrictGroup } from './district-group.ts';
import { getBenchmarks } from './benchmarks.ts';
import { getAlls } from './all.ts';
import { getFloodHotspots } from './flood.ts';

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

  const benchmarks = getBenchmarks(latestYearReport);

  const alls = getAlls(all, yearReports, latestYearReport, benchmarks);

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
    benchmarks: benchmarks.floodBenchmarks,
    meanFloodLevel: latestYearReport.districtGroups.find(g => g.district === 'residence')?.floodWaterLevel || null,
    meanFloodLevelMaximumPoint: residence.getMin(ProblemType.Flood, yr => yr.floodWaterLevel),
  };

  return {
    alls,
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