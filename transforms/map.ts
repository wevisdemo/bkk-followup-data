import { District as ExtractedDistrict } from '../extracts/district.ts';
import { ProblemType } from '../models/problem-type.ts';
import { YearReport } from '../models/year-report.ts';
import { Maps, MapEntry, MapPointByDistrict } from '../models/map.ts';

export function transformMaps(
  yearReports: YearReport[],
  districts: ExtractedDistrict[],
): Maps {
  return {
    [ProblemType.Flood]: getMaps(yearReports, districts, ProblemType.Flood),
    [ProblemType.Waste]: getMaps(yearReports, districts, ProblemType.Waste),
    [ProblemType.Green]: getMaps(yearReports, districts, ProblemType.Green),
    [ProblemType.Water]: getMaps(yearReports, districts, ProblemType.Water),
    [ProblemType.Air]: getMaps(yearReports, districts, ProblemType.Air),
  };
}

function getMaps(
  yearReports: YearReport[],
  districts: ExtractedDistrict[],
  problem: ProblemType,
): MapEntry {
  const byYear = {} as { [key:number]: MapPointByDistrict };

  yearReports.forEach(report => {
    const eachYear = {} as MapPointByDistrict;
    report.districts.forEach(yr => {
      const district = districts.find(d => d.district === yr.district);
      if (!district) return;
      eachYear[district.id] = { districtName: district.district, value: yr.getValueOf(problem) };
    })
    byYear[report.year] = eachYear;
  });

  return {
    byYear,
  }
}