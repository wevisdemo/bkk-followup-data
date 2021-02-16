
import { YearReport } from '../extracts/year-report.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';
import { District } from './district.ts';
import { YearRow } from '../models/year-row.ts';
import { ReportSuite } from './models/reports.ts';
import { ProblemType } from '../models/problem-type.ts';
import { DistrictGroup } from './district-group.ts';
import { getBenchmarks } from './benchmarks.ts';
import { getAlls } from './all.ts';
import { DistrictAreaType, getDistrictArea } from './district-area.ts';
import { getSingleDistrict } from './single-district.ts';

export function transformReports(
  yearReports: YearReport[],
  extractedDistricts: ExtractedDistrict[],
  ): ReportSuite {
  yearReports.sort((a, b) => a.year - b.year);
  const latestYearReport = yearReports[yearReports.length - 1];
  const districts = extractedDistricts.map((d, i) => getDistrict(yearReports, d, i));
  
  const all = new DistrictGroup(districts, 'all');
  const residence = new DistrictGroup(districts.filter(d => d.type === 'residence'), 'residence');
  const suburban = new DistrictGroup(districts.filter(d => d.type === 'suburban'), 'suburban');
  const tourism = new DistrictGroup(districts.filter(d => d.type === 'tourism-and-cultural'), 'tourism-and-cultural');
  const business = new DistrictGroup(districts.filter(d => d.type === 'business'), 'business');

  const benchmarks = getBenchmarks(latestYearReport);
  const rankings = {
    [ProblemType.Flood]: all.getAllRankings(ProblemType.Flood),
    [ProblemType.Waste]: all.getAllRankings(ProblemType.Waste),
    [ProblemType.Green]: all.getAllRankings(ProblemType.Green),
    [ProblemType.Water]: all.getAllRankings(ProblemType.Water),
    [ProblemType.Air]: all.getAllRankings(ProblemType.Air),
  };

  const alls = getAlls(all, yearReports, latestYearReport, benchmarks);

  return {
    alls,
    areas: {
      residence: getDistrictArea(residence, DistrictAreaType.Residence, yearReports, latestYearReport, benchmarks),
      suburban: getDistrictArea(suburban, DistrictAreaType.Suburban, yearReports, latestYearReport, benchmarks),
      'tourism-and-cultural': getDistrictArea(tourism, DistrictAreaType.Tourism, yearReports, latestYearReport, benchmarks),
      business: getDistrictArea(business, DistrictAreaType.Business, yearReports, latestYearReport, benchmarks),
    },
    districts: districts.map(d => getSingleDistrict(d, rankings)),
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