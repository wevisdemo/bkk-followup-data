import { parse, ColumnOptions } from 'https://deno.land/std@0.86.0/encoding/csv.ts';
import { districtTypeParser, numberParser } from './utils.ts';

export async function extractDistricts(csvPath: string): Promise<District[]> {
  const raw = await (await fetch(csvPath)).text();
  const districts = await parse(raw, {
    skipFirstRow: true,
    columns: columnOptions,
    parse: districtParser,
  }) as District[];

  return districts;
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
];

function floodSpotParser(i: string): string[] | null {
  if (i.length === 0) {
    return null;
  }
  return i.split('\n').map(e => e.replaceAll('- ', ''));
}