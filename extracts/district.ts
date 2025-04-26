import { parse } from 'https://deno.land/std@0.224.0/csv/parse.ts';
import { districtTypeParser, numberParser } from './utils.ts';

export async function extractDistricts(csvPath: string): Promise<{
  districts: District[],
  all: District,
  districtAreas: District[],
  }> {
  const raw = await (await fetch(csvPath)).text();
  const districts = await parse(raw, {
    skipFirstRow: true,
    columns,
  });
  const mapped = districts.map(districtParser);
  mapped.forEach((e, i) => e.id = i + 1);

  return {
    districts: mapped,
    all: mapped.splice(districts.length - 1)[0],
    districtAreas: mapped
      .splice(mapped.length - 4)
      .map(a => ({ ...a, district: districtTypeParser(a.district) } as District)),
  };
}

export interface District {
  id: number;
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

function districtParser(i: Record<string, string | undefined>): District {
  return {
    id: 0,
    district: i['district'] as string,
    type: districtTypeParser(i['group']),
    publicGreenSpace: numberParser(i['access_green']) || 0,
    floodHotspot: 
      floodSpotParser(i['flood_spot'])?.map((e: string) => ({
        name: e.split(',')[0].trim(),
        description: e.split(',')[1].trim(),
      })) || [],
    area: numberParser(i['area']) || 0,
    minimumPopulationDensity: numberParser(i['pop_density_min']) || 0,
    maximumPopulationDensity: numberParser(i['pop_density_max']) || 0,
    pm25OverThresholdCount: numberParser(i['pm25_over']),
    pm25MeasurementCount: numberParser(i['pm25_measurement']),
  };
}

const columns = [
  'district',
  'group',
  'access_green',
  'flood_spot',
  'area',
  'pop_density_min',
  'pop_density_max',
  'pm25_over',
  'pm25_measurement',
];


function floodSpotParser(i?: string): string[] | null {
  if (i === undefined || i.length === 0) {
    return null;
  }
  return i.split('\n').map(e => e.replaceAll('- ', ''));
}