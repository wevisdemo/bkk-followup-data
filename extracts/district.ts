import { parse, ColumnOptions } from 'https://deno.land/std@0.86.0/encoding/csv.ts';
import { districtTypeParser, numberParser } from './utils.ts';

export async function extractDistricts(csvPath: string): Promise<{
  districts: District[],
  all: District,
  districtAreas: District[],
  }> {
  const raw = await (await fetch(csvPath)).text();
  const districts = await parse(raw, {
    skipFirstRow: true,
    columns: columnOptions,
    parse: districtParser,
  }) as District[];

  return {
    districts,
    all: districts.splice(districts.length - 1)[0],
    districtAreas: districts
      .splice(districts.length - 4)
      .map(a => ({ ...a, district: districtTypeParser(a.district) } as District)),
  };
}

export interface District {
  district: string;
  type: DistrictAreaType;
  publicGreenSpace: number;
  floodHotspot: {
    name: string;
		description: string;
  }[];
  area: number;
  minimumPopulationDensity: number;
  maximumPopulationDensity: number;
  pm25OverThresholdCount: number | null;
  pm25MeasurementCount: number | null;
}

export type DistrictAreaType = 'residence' | 'suburban' | 'business' | 'tourism-and-cultural' | null;

function districtParser(i: unknown): District {
  const casted = i as Record<string, unknown>;
  return {
    district: casted['district'] as string,
    type: casted['group'] as DistrictAreaType,
    publicGreenSpace: casted['access_green'] as number,
    floodHotspot: 
      (casted['flood_spot'] as string[])?.map((e: string) => ({
        name: e.split(',')[0].trim(),
        description: e.split(',')[1].trim(),
      })),
    area: casted['area'] as number,
    minimumPopulationDensity: casted['pop_density_min'] as number,
    maximumPopulationDensity: casted['pop_density_max'] as number,
    pm25OverThresholdCount: casted['pm25_over'] as number | null,
    pm25MeasurementCount: casted['pm25_measurement'] as number | null,
  };
}

const columnOptions: ColumnOptions[] = [
  {
    name: 'district'
  }, 
  {
    name: 'group',
    parse: districtTypeParser,
  },
  {
    name: 'access_green',
    parse: numberParser,
  },
  {
    name: 'flood_spot',
    parse: floodSpotParser,
  },
  {
    name: 'area',
    parse: numberParser,
  },
  {
    name: 'pop_density_min',
    parse: numberParser,
  },
  {
    name: 'pop_density_max',
    parse: numberParser,
  },
  {
    name: 'pm25_over',
    parse: numberParser,
  },
  {
    name: 'pm25_measurement',
    parse: numberParser,
  },
];

function floodSpotParser(i: string): string[] | null {
  if (i.length === 0) {
    return null;
  }
  return i.split('\n').map(e => e.replaceAll('- ', ''));
}