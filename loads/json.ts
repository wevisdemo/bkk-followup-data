import { BaseReport } from '../models/base-report.ts';
import { Maps } from '../models/map.ts';
import { ProblemType } from '../models/problem-type.ts';
import { ReportSuite } from '../models/reports.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';

export async function loadReportSuiteToJsonFiles(suite: ReportSuite, path = '.') {
  await writeReports(suite.alls, path, 'all');
  await writeReports(suite.areas.residence, path, 'residence');
  await writeReports(suite.areas.suburban, path, 'suburban');
  await writeReports(suite.areas['tourism-and-cultural'], path, 'tourism-and-cultural');
  await writeReports(suite.areas.business, path, 'business');
  for (const d of suite.districts) {
    await writeReports(d.problems, path, String(`district${d.id}`));
  }
}

function writeReports(
  reports: { [key in ProblemType]: BaseReport },
  path: string,
  zone: string,
  ) {
    return Promise.all([
      Deno.writeTextFile(`${path}/report_flood_${zone}.json`, JSON.stringify(reports[ProblemType.Flood], null, 2)),
      Deno.writeTextFile(`${path}/report_waste_${zone}.json`, JSON.stringify(reports[ProblemType.Waste], null, 2)),
      Deno.writeTextFile(`${path}/report_green_${zone}.json`, JSON.stringify(reports[ProblemType.Green], null, 2)),
      Deno.writeTextFile(`${path}/report_water_${zone}.json`, JSON.stringify(reports[ProblemType.Water], null, 2)),
      Deno.writeTextFile(`${path}/report_air_${zone}.json`, JSON.stringify(reports[ProblemType.Air], null, 2)), 
    ]);
}

export async function loadMapsToJsonFiles(maps: Maps, path = '.') {
  return Promise.all([
    Deno.writeTextFile(`${path}/map_flood.json`, JSON.stringify(maps[ProblemType.Flood], null, 2)),
    Deno.writeTextFile(`${path}/map_waste.json`, JSON.stringify(maps[ProblemType.Waste], null, 2)),
    Deno.writeTextFile(`${path}/map_green.json`, JSON.stringify(maps[ProblemType.Green], null, 2)),
    Deno.writeTextFile(`${path}/map_water.json`, JSON.stringify(maps[ProblemType.Water], null, 2)),
    Deno.writeTextFile(`${path}/map_air.json`, JSON.stringify(maps[ProblemType.Air], null, 2)), 
  ]);
}

export async function loadDistrictsToJsonFiles(districts: ExtractedDistrict[], path = '.') {
  const mapped = districts.map(d => ({
    id: d.id,
    name: d.district,
    districtType: d.type,
    areaSize: d.area,
    minimumPopulationDensity: d.minimumPopulationDensity,
    maximumPopluationDensity: d.maximumPopulationDensity,
  }));
  return Deno.writeTextFile(`${path}/districts.json`, JSON.stringify(mapped, null, 2));
}