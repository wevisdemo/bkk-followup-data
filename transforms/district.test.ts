import {
  assertEquals,
} from "https://deno.land/std@0.86.0/testing/asserts.ts";
import { District } from './district.ts';
import { ProblemType } from '../models/problem-type.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';
import { YearRow } from '../models/year-row.ts';

Deno.test('District getMin and getMax should return correct min and max', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: mockYearRowForFlood(1),
      2556: mockYearRowForFlood(2),
    }
  );

  assertEquals(dis.getMinimumValue(ProblemType.Flood), { year: 2555, value: 1 });
  assertEquals(dis.getMaximumValue(ProblemType.Flood), { year: 2556, value: 2 });
});

Deno.test('District getMin and getMax should be able to use custom sort function', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: mockYearRowForFlood(1, 15),
      2556: mockYearRowForFlood(2, 10),
    }
  );

  assertEquals(dis.getMinimumValue(ProblemType.Flood, yr => yr.floodWaterLevel), { year: 2556, value: 10 });
  assertEquals(dis.getMaximumValue(ProblemType.Flood, yr => yr.floodWaterLevel), { year: 2555, value: 15 });
});

Deno.test('District should set budgets for each problems and all', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: mockYearRowForFlood(0, 0, 100),
      2556: mockYearRowForFlood(0, 0, 200),
    }
  );

  assertEquals(dis.budgets[ProblemType.Flood], { 2555: 100, 2556: 200 });
});

Deno.test('District getRankings should return rankings in term of years', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: mockYearRowForFlood(400),
      2556: mockYearRowForFlood(300),
    }
  );
  assertEquals(dis.getRankings(ProblemType.Flood), [
    { ranked: 1, year: 2555, value: 400 },
    { ranked: 2, year: 2556, value: 300 },
  ]);
});

Deno.test('District getRankings should return rankings of flood using frequency', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: mockYearRowForFlood(2000, 1),
      2556: mockYearRowForFlood(1000, 2),
    }
  );

  assertEquals(dis.getRankings(ProblemType.Flood), [
    { ranked: 1, year: 2555, value: 2000 },
    { ranked: 2, year: 2556, value: 1000 },
  ]);
});

Deno.test('District getRankings should return rankings using custom rank function', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: mockYearRowForFlood(1100, 2000),
      2556: mockYearRowForFlood(1200, 1000),
    }
  );
  assertEquals(dis.getRankings(ProblemType.Flood, (yr) => yr.floodWaterLevel ), [
    { ranked: 1, year: 2555, value: 2000 },
    { ranked: 2, year: 2556, value: 1000 },
  ]);
});

function mockYearRowForFlood(frequency: number, level?: number, budget?: number): YearRow {
  const y = new YearRow();
  y.floodFrequency = frequency;
  y.floodWaterLevel = level || 0;
  y.floodBudget = budget || 0;
  return y;
}