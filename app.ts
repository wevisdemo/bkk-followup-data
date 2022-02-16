import { extractDistricts } from './extracts/district.ts';
import { extractYear } from './extracts/year.ts';
import { loadMapsToJsonFiles, loadReportSuiteToJsonFiles, loadDistrictsToJsonFiles } from './loads/json.ts';
import { transformMaps } from './transforms/map.ts';
import { transformReports } from './transforms/report.ts';
import { Config } from './config.ts';


const config = new Config('./config.json');

const years = await Promise.all(
    Object.entries(config.summaryDataSheets)
      .map(([no, url]) => {
        return extractYear(url, Number(no));
    })
  );

const { districts, all, districtAreas } = await extractDistricts(config.districtSheet);

const suite = transformReports(years, districts, all, districtAreas);
const maps = transformMaps(years, districts);

await loadReportSuiteToJsonFiles(suite, './result');
await loadMapsToJsonFiles(maps, './result');
await loadDistrictsToJsonFiles(districts, './result');
