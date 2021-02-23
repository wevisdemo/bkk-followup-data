import {
  assertEquals,
} from 'https://deno.land/std@0.86.0/testing/asserts.ts';
import { ProblemType } from '../models/problem-type.ts';
import { YearRow } from '../models/year-row.ts';
import { getYearRankings } from './year-ranking.ts';

Deno.test('GetYearRankings returns district names for each problems', () => {
  const result = getYearRankings([{
    year: 2550,
    all: {} as YearRow,
    districts: [mockYearRowWithAir('A', 1), mockYearRowWithAir('B', 2)],
    districtGroups: [],
  }]);

  assertEquals(['B', 'A'], result[2550][ProblemType.Air]);
});

Deno.test('GetYearRankings should ignore district without problem values', () => {
  const result = getYearRankings([{
    year: 2550,
    all: {} as YearRow,
    districts: [mockYearRowWithAir('ThisIsNull', null), mockYearRowWithAir('A', 1)],
    districtGroups: [],
  }]);

  assertEquals(['A'], result[2550][ProblemType.Air]);
});

function mockYearRowWithAir(districtName: string, airValue: number | null): YearRow {
  const yr = new YearRow();
  yr.district = districtName;
  yr.airData = airValue;
  return yr;
}