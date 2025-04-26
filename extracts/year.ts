import { YearReport } from '../models/year-report.ts';
import { parse } from 'https://deno.land/std@0.224.0/csv/parse.ts';
import { YearRow } from '../models/year-row.ts';
import { districtTypeParser, numberParser } from './utils.ts';

const HEADER_ROW_COUNT = 2;
const DISTRICT_GROUP_COUNT = 4;

export async function extractYear(csvPath: string, year: number): Promise<YearReport> {
  const raw = await (await fetch(csvPath)).text();
  const rows = await parse(raw, {
    skipFirstRow: true,
    columns,
  });

  const mapped: YearRow[] = rows.map(yearRowParser)

  return {
    year,
    all: mapped[1],
    districts: mapped.splice(2, rows.length - HEADER_ROW_COUNT - DISTRICT_GROUP_COUNT),
    districtGroups: mapped
      .splice(rows.length - DISTRICT_GROUP_COUNT)
      .map(r => { r.district = districtTypeParser(r.district!) as string; return r }),
  };
}

function yearRowParser(i: Record<string, string | undefined>): YearRow {
  const yr = new YearRow();
  yr.district = i['dist'];
  yr.budgetTotal = numberParser(i['budget_total']);
  yr.floodBudget = numberParser(i['flood_bud']);
  yr.floodFrequency = numberParser(i['flood_data1']);
  yr.wasteBudget = numberParser(i['waste_bud']);
  yr.wasteData = numberParser(i['waste_data']);
  yr.greenBudget = numberParser(i['green_bud']);
  yr.greenData = numberParser(i['green_data']);
  yr.waterBudget = numberParser(i['water_bud']);
  yr.waterData = numberParser(i['water_data']);
  yr.airBudget = numberParser(i['air_bud']);
  yr.airData = numberParser(i['air_data']);
  yr.floodWaterLevel = numberParser(i['flood_data2']);
  return yr;
}

const columns = [
  'dist',
  'budget_total',
  'flood_bud',
  'flood_data1',
  'waste_bud',
  'waste_data',
  'green_bud',
  'green_data',
  'water_bud',
  'water_data',
  'air_bud',
  'air_data',
  'flood_data2',
];
