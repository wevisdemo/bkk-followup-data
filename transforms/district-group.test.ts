import {
  assertEquals,
} from 'https://deno.land/std@0.86.0/testing/asserts.ts';
import { District } from './district.ts';
import { DistrictGroup } from './district-group.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';
import { YearRow } from '../models/year-row.ts';
import { ProblemType } from '../models/problem-type.ts';

Deno.test('DistrictGroup should sum every years\' budgets', () => {
  const area = new DistrictGroup([
    new District(
      {} as ExtractedDistrict,
      {
        2555: mockYearRowForAirBudget(100),
        2556: mockYearRowForAirBudget(200),
      },
    ),
    new District(
      {} as ExtractedDistrict,
      {
        2555: mockYearRowForAirBudget(10),
        2556: mockYearRowForAirBudget(20),
      },
    )
  ], 'all');

  assertEquals(area.getProblemBudgets(ProblemType.Air), { 2555: 110, 2556: 220 });
});

Deno.test('DistrictGroup GetAllRankings should return rankings by district', () => {
  const rankings = new DistrictGroup([
    new District(
      mockExtractedDistrict('Zero', 0), 
      { 2555: mockYearRowForGreen(20) }
    ),
    new District(
      mockExtractedDistrict('One', 1), 
      { 2555: mockYearRowForGreen(10) }
    )
  ], 'all').getAllRankings(ProblemType.Green);

  assertEquals([
    { ranked: 1, districtId: 0, districtName: 'Zero', value: 20 },
    { ranked: 2, districtId: 1, districtName: 'One', value: 10 },
  ], rankings);
});

Deno.test('DistrictGroup GetAllRankings should return rankings by district using custom sort by value getter', () => {
  const rankings = new DistrictGroup([
    new District(
      mockExtractedDistrict('Zero', 0), 
      { 2555: mockYearRowForFlood(10, 40) }
    ),
    new District(
      mockExtractedDistrict('One', 1), 
      { 2555: mockYearRowForFlood(20, 30) }
    )
  ], 'all').getAllRankings(ProblemType.Green, (yr: YearRow) => yr.floodWaterLevel );

  assertEquals([
    { ranked: 1, districtId: 0, districtName: 'Zero', value: 40 },
    { ranked: 2, districtId: 1, districtName: 'One', value: 30 },
  ], rankings);
});

function mockYearRowForAirBudget(budget: number): YearRow {
  const y = new YearRow();
  y.airBudget = budget;
  return y;
}

function mockYearRowForGreen(value: number): YearRow {
  const y = new YearRow();
  y.greenData = value;
  return y;
}

function mockYearRowForFlood(frequency: number, level: number): YearRow {
  const y = new YearRow();
  y.floodFrequency = frequency;
  y.floodWaterLevel = level;
  return y;
}

function mockExtractedDistrict(name: string, id: number): ExtractedDistrict {
  return { 
    id,
    district: name,
    type: 'suburban',
    publicGreenSpace: 0,
    floodHotspot: [],
    area: 0,
    minimumPopulationDensity: 0,
    maximumPopulationDensity: 0,
    pm25MeasurementCount: null,
    pm25OverThresholdCount: null,
  }; 
}