import {
  assertEquals,
} from 'https://deno.land/std@0.86.0/testing/asserts.ts';
import { District } from './district.ts';
import { DistrictGroup } from './district-group.ts';
import { District as ExtractedDistrict } from '../extracts/district.ts';
import { YearRow } from '../extracts/year-row.ts';
import { ProblemType } from './problem-type.ts';

Deno.test('DistrictGroup should sum every years\' budgets', () => {
  const area = new DistrictGroup([
    new District(
      0,
      {} as ExtractedDistrict,
      {
        2555: { ...new YearRow(), airBudget: 100 },
        2556: { ...new YearRow(), airBudget: 200 },
      },
    ),
    new District(
      1,
      {} as ExtractedDistrict,
      {
        2555: { ...new YearRow(), airBudget: 10 },
        2556: { ...new YearRow(), airBudget: 20 },
      },
    )
  ]);

  assertEquals(area.getProblemBudgets(ProblemType.Air), { 2555: 110, 2556: 220 });
});

Deno.test('DistrictGroup GetAllRankings should return rankings by district', () => {
  const rankings = new DistrictGroup([
    new District(
      0,
      mockExtractedDistrict('Zero'), 
      {
        2555: { ...new YearRow(),  greenData: 20 },
      }
    ),
    new District(
      1,
      mockExtractedDistrict('One'), 
      { 2555: { ...new YearRow(),  greenData: 10 } }
    )
  ]).getAllRankings(ProblemType.Green);

  assertEquals([
    { ranked: 1, districtId: 1, districtName: 'One', value: 10 },
    { ranked: 2, districtId: 0, districtName: 'Zero', value: 20 },
  ], rankings);
});

Deno.test('DistrictGroup GetAllRankings should return rankings by district using custom sort by value getter', () => {
  const rankings = new DistrictGroup([
    new District(
      0,
      mockExtractedDistrict('Zero'), 
      { 2555: { ...new YearRow(),  floodData1: 10, floodData2: 40 } }
    ),
    new District(
      1,
      mockExtractedDistrict('One'), 
      { 2555: { ...new YearRow(),  floodData1: 20, floodData2: 30 } }
    )
  ]).getAllRankings(ProblemType.Green, (yr: YearRow) => yr.floodData2 );

  assertEquals([
    { ranked: 1, districtId: 1, districtName: 'One', value: 30 },
    { ranked: 2, districtId: 0, districtName: 'Zero', value: 40 },
  ], rankings);
});

function mockExtractedDistrict(name: string): ExtractedDistrict {
  return { 
    district: name,
    type: 'suburban',
    publicGreenSpace: 0,
    floodHotspot: [],
    area: 0,
    minimumPopulationDensity: 0,
    maximumPopulationDensity: 0,
  }; 
}