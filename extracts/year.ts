import { YearReport } from './year-report.ts';
import { parse, ColumnOptions } from 'https://deno.land/std@0.86.0/encoding/csv.ts';
import { YearRow } from '../models/year-row.ts';
import { districtTypeParser, numberParser } from './utils.ts';

const HEADER_ROW_COUNT = 2;
const DISTRICT_GROUP_COUNT = 4;

export async function extractYear(csvPath: string, year: number): Promise<YearReport> {
  const raw = await (await fetch(csvPath)).text();
  const rows = await parse(raw, {
    skipFirstRow: true,
    columns: columnOptions,
    parse: yearRowParser,
  }) as YearRow[];

  return {
    year,
    all: rows[1],
    districts: rows.splice(2, rows.length - HEADER_ROW_COUNT - DISTRICT_GROUP_COUNT),
    districtGroups: rows
      .splice(rows.length - DISTRICT_GROUP_COUNT)
      .map(r => { r.district = districtTypeParser(r.district!) as string; return r }),
  };
}

function yearRowParser(i: unknown): YearRow {
  const casted = i as Record<string, string | number | null>;
  const yr = new YearRow();
  yr.district = casted['dist'] as string;
  yr.budgetTotal = casted['budget_total'] as number | null;
  yr.floodBudget = casted['flood_bud'] as number | null;
  yr.floodFrequency = casted['flood_data1'] as number | null;
  yr.wasteBudget = casted['waste_bud'] as number | null;
  yr.wasteData = casted['waste_data'] as number | null;
  yr.greenBudget = casted['green_bud'] as number | null;
  yr.greenData = casted['green_data'] as number | null;
  yr.waterBudget = casted['water_bud'] as number | null;
  yr.waterData = casted['water_data'] as number | null;
  yr.airBudget = casted['air_bud'] as number | null;
  yr.airData = casted['air_data'] as number | null;
  yr.floodWaterLevel = casted['flood_data2'] as number | null;
  return yr;
}

const columnOptions: ColumnOptions[] = [
  {
    name: 'dist'
  }, 
  {
    name: 'budget_total',
    parse: numberParser,
  },
  {
    name: 'flood_bud',
    parse: numberParser,
  },
  {
    name: 'flood_data1',
    parse: numberParser,
  },
  {
    name: 'waste_bud',
    parse: numberParser,
  },
  {
    name: 'waste_data',
    parse: numberParser,
  },
  {
    name: 'green_bud',
    parse: numberParser,
  },
  {
    name: 'green_data',
    parse: numberParser,
  },
  {
    name: 'water_bud',
    parse: numberParser,
  },
  {
    name: 'water_data',
    parse: numberParser,
  },
  {
    name: 'air_bud',
    parse: numberParser,
  },
  {
    name: 'air_data',
    parse: numberParser,
  },
  {
    name: 'flood_data2',
    parse: numberParser,
  },
];
