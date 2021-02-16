import { YearReport } from '../extracts/year-report.ts';
import { ProblemType } from '../models/problem-type.ts';
import { DistrictAreaBenchmark } from './models/zonetype-reports.ts';

export function getBenchmarks(latestYearReport: YearReport) {
  return {
    floodBenchmarks: getBenchmark(latestYearReport, ProblemType.Flood),
    wasteBenchmarks: getBenchmark(latestYearReport, ProblemType.Waste),
    greenBenchmarks: getBenchmark(latestYearReport, ProblemType.Green),
    waterBenchmarks: getBenchmark(latestYearReport, ProblemType.Waste),
    airBenchmarks: getBenchmark(latestYearReport, ProblemType.Air),
  };
}

function getBenchmark(latestYearReport: YearReport, problem: ProblemType): DistrictAreaBenchmark[] {
  const latestResidence = latestYearReport.districtGroups.find(g => g.district === 'residence');
  const latestSuburban = latestYearReport.districtGroups.find(g => g.district === 'suburban');
  const latestTourism = latestYearReport.districtGroups.find(g => g.district === 'tourism-and-cultural');
  const latestBusiness = latestYearReport.districtGroups.find(g => g.district === 'business');

  return [
    {
      zoneId: 'all',
      areaName: 'ทุกเขตในกรุงเทพมหานคร',
      value: latestYearReport.all.getValueOf(problem)
    },
    {
      zoneId: 'residence',
      areaName: 'ทุกเขตพื้นที่อยู่อาศัย',
      value: latestResidence?.getValueOf(problem) || null
    },
    {
      zoneId: 'suburban',
      areaName: 'ทุกเขตพื้นที่อยู่อาศัยชานเมือง',
      value: latestSuburban?.getValueOf(problem) || null
    },
    {
      zoneId: 'tourism-and-cultural',
      areaName: 'พื้นที่อนุรักษ์ศิลปวัฒนธรรมและส่งเสริมการท่องเที่ยว',
      value: latestTourism?.getValueOf(problem) || null
    },
    {
      zoneId: 'business',
      areaName: 'พื้นที่ศูนย์กลางธุรกิจและพาณิชยกรรม',
      value: latestBusiness?.getValueOf(problem) || null
    },
  ] as DistrictAreaBenchmark[];
}
