import { DistrictGroup } from './district-group.ts';

export  function getFloodHotspots(districtGroup: DistrictGroup): { name: string, description: string }[] {
  return districtGroup.districts.map(d => d.floodHotspot).filter(hs => hs).reduce((p, n) => p.concat(n), []);
}