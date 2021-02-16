import { BaseReport } from '../models/base-report.ts';
import { ProblemType } from '../models/problem-type.ts';
import { ReportSuite } from '../models/reports.ts';

export async function loadToJsonFiles(suite: ReportSuite, path = '.') {
  await writeReports(suite.alls, path, 'all');
  await writeReports(suite.areas.residence, path, 'residence');
  await writeReports(suite.areas.suburban, path, 'residence');
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
