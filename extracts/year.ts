import { YearReport } from './year-report.ts';
import { parse, ColumnOptions } from 'https://deno.land/std@0.86.0/encoding/csv.ts';
import { YearRow } from './year-row.ts';
import { numberParser } from './utils.ts';

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
    districts: rows.splice(2),
  };
}

function yearRowParser(i: unknown): YearRow {
  const casted = i as Record<string, string | number | null>;
  return {
    district: casted['dist'] as string,
    budgetTotal: casted['budget_total'] as number | null,
    floodBudget: casted['flood_bud'] as number | null,
    floodData: casted['flood_data'] as number | null,
    wasteBudget: casted['waste_bud'] as number | null,
    wasteData: casted['waste_data'] as number | null,
    greenBudget: casted['green_bud'] as number | null,
    greenData: casted['green_data'] as number | null,
    waterBudget: casted['water_bud'] as number | null,
    waterData: casted['water_data'] as number | null,
    airBudget: casted['air_bud'] as number | null,
    airData: casted['air_data'] as number | null,
  };
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
    name: 'flood_data',
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
];
