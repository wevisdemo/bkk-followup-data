import { YearReport } from '../models/year-report.ts';
import { ProblemType } from '../models/problem-type.ts';
import { DistrictAreaType } from './district-area.ts';
import { DistrictAreaBenchmark } from './models/zonetype-reports.ts';

export function getBenchmarks(latestYearReport: YearReport) {
  return {
    [ProblemType.Flood]: getBenchmark(latestYearReport, ProblemType.Flood),
    [ProblemType.Waste]: getBenchmark(latestYearReport, ProblemType.Waste),
    [ProblemType.Green]: getBenchmark(latestYearReport, ProblemType.Green),
    [ProblemType.Water]: getBenchmark(latestYearReport, ProblemType.Water),
    [ProblemType.Air]: getBenchmark(latestYearReport, ProblemType.Air),
  };
}

function getBenchmark(latestYearReport: YearReport, problem: ProblemType): DistrictAreaBenchmark[] {
  const latestResidence = latestYearReport.districtGroups.find(g => g.district === DistrictAreaType.Residence);
  const latestSuburban = latestYearReport.districtGroups.find(g => g.district === DistrictAreaType.Suburban);
  const latestTourism = latestYearReport.districtGroups.find(g => g.district === DistrictAreaType.Tourism);
  const latestBusiness = latestYearReport.districtGroups.find(g => g.district === DistrictAreaType.Business);

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
