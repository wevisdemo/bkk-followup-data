import { ProblemType } from '../models/problem-type.ts';
import { District } from './district.ts';
import { DistrictGroup } from './district-group.ts';

const AIR_QUALITY_THRESHOLD = 1;

export function getAirSamplingCount(entity: DistrictGroup | District): {
  count: number;
  aboveThresholdCount: number;
} {
  let samplings: number[] = [];
  if (entity instanceof District) {
    samplings = getAirSampling(entity);
  } else {
    samplings = entity.districts.map(d => getAirSampling(d)).reduce((p, n) => p.concat(n), []);
  }
  const aboves = samplings.filter(s => s > AIR_QUALITY_THRESHOLD);

  return {
    count: samplings.length,
    aboveThresholdCount: aboves.length,
  }
}

function getAirSampling(district: District): number[] {
  const airSampling = [];
  for (const year in district.years) {
    const value = district.years[parseInt(year)].getValueOf(ProblemType.Air);
    if (value !== null) airSampling.push(value);
  }
  return airSampling;
}