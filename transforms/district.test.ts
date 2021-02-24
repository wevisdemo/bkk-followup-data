import {
  assertEquals,
} from "https://deno.land/std@0.86.0/testing/asserts.ts";
import { District } from './district.ts';
import { ProblemType } from '../models/problem-type.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';
import { YearRow } from '../models/year-row.ts';

Deno.test('District getMin and getMax should return correct min and max', () => {
  const dis = new District(
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
    {} as ExtractedDistrict,
    {
      2555: mockYearRowForFlood(1, 15),
      2556: mockYearRowForFlood(2, 10),
    }
  );

  assertEquals(dis.getMinimumValue(ProblemType.Flood, yr => yr.floodWaterLevel), { year: 2556, value: 10 });
  assertEquals(dis.getMaximumValue(ProblemType.Flood, yr => yr.floodWaterLevel), { year: 2555, value: 15 });
});

Deno.test('District getRankings should return rankings using provided year rankings', () => {
  const dis = new District(
    { district: 'Thawi Watthana' } as ExtractedDistrict,
    {
      2555: mockYearRowForFlood(400),
    }
  );
  assertEquals(dis.getRankings(ProblemType.Flood, { 
    2555: {
      [ProblemType.Flood]: ['A', 'B', 'Thawi Watthana', 'D'],
      [ProblemType.Waste]: [], 
      [ProblemType.Green]: [], 
      [ProblemType.Water]: [], 
      [ProblemType.Air]: [], 
    }}), [
    { ranked: 3, year: 2555, value: 400 },
  ]);
});

Deno.test('District getRankings should not return rankings in that problem when its value is null', () => {
  const dis = new District(
    { district: 'Thawi Watthana' } as ExtractedDistrict,
    {
      2555: mockYearRowForFlood(400),
    }
  );
  assertEquals(dis.getRankings(ProblemType.Air, { 
    2555: {
      [ProblemType.Flood]: ['A', 'B', 'Thawi Watthana', 'D'],
      [ProblemType.Waste]: [], 
      [ProblemType.Green]: [], 
      [ProblemType.Water]: [], 
      [ProblemType.Air]: [], 
    }}), []);
});

Deno.test('District getRankings should return rankings sorted from year asc', () => {
  const dis = new District(
    { district: 'Thawi Watthana' } as ExtractedDistrict,
    {
      2556: mockYearRowForFlood(300),
      2555: mockYearRowForFlood(400),
    }
  );
  assertEquals(dis.getRankings(ProblemType.Flood, { 
    2556: {
      [ProblemType.Flood]: ['A', 'Thawi Watthana', 'C', 'D'],
      [ProblemType.Waste]: [], 
      [ProblemType.Green]: [], 
      [ProblemType.Water]: [], 
      [ProblemType.Air]: [], 
    },
    2555: {
      [ProblemType.Flood]: ['A', 'B', 'Thawi Watthana', 'D'],
      [ProblemType.Waste]: [], 
      [ProblemType.Green]: [], 
      [ProblemType.Water]: [], 
      [ProblemType.Air]: [], 
    }}), [
      { ranked: 3, year: 2555, value: 400 },
      { ranked: 2, year: 2556, value: 300 },
    ]);
});

function mockYearRowForFlood(frequency: number, level?: number, budget?: number): YearRow {
  const y = new YearRow();
  y.floodFrequency = frequency;
  y.floodWaterLevel = level || 0;
  y.floodBudget = budget || 0;
  return y;
}