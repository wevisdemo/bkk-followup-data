import {
  assertEquals,
} from "https://deno.land/std@0.86.0/testing/asserts.ts";
import { District } from './district.ts';
import { ProblemType } from './problem-type.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';
import { YearRow } from '../extracts/year-row.ts';

Deno.test('District should set mins & maxes for each problems', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: { ...new YearRow(), floodFrequency: 1 },
      2556: { ...new YearRow(), floodFrequency: 2 },
    }
  );

  assertEquals(dis.mins[ProblemType.Flood], { year: 2555, value: 1 });
  assertEquals(dis.maxes[ProblemType.Flood], { year: 2556, value: 2 });
});

Deno.test('District should set budgets for each problems and all', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: { ...new YearRow(), floodBudget: 100 },
      2556: { ...new YearRow(), floodBudget: 200 },
    }
  );

  assertEquals(dis.budgets[ProblemType.Flood], { 2555: 100, 2556: 200 });
});

Deno.test('District getRankings should return rankings in term of years', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: { ...new YearRow(), airData: 400 },
      2556: { ...new YearRow(), airData: 300 },
    }
  );
  assertEquals(dis.getRankings(ProblemType.Air), [
    { ranked: 1, year: 2556, value: 300 },
    { ranked: 2, year: 2555, value: 400 },
  ]);
});

Deno.test('District getRankings should return rankings of flood using frequency', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: { ...new YearRow(), floodFrequency: 2000 },
      2556: { ...new YearRow(), floodFrequency: 1000 },
    }
  );

  assertEquals(dis.getRankings(ProblemType.Flood), [
    { ranked: 1, year: 2556, value: 1000 },
    { ranked: 2, year: 2555, value: 2000 },
  ]);
});

Deno.test('District getRankings should return rankings using custom rank function', () => {
  const dis = new District(
    0,
    {} as ExtractedDistrict,
    {
      2555: { ...new YearRow(), floodFrequency: 1100, floodWaterLevel: 2000 },
      2556: { ...new YearRow(), floodFrequency: 1200, floodWaterLevel: 1000 },
    }
  );
  assertEquals(dis.getRankings(ProblemType.Flood, (yr) => yr.floodWaterLevel ), [
    { ranked: 1, year: 2556, value: 1000 },
    { ranked: 2, year: 2555, value: 2000 },
  ]);
});