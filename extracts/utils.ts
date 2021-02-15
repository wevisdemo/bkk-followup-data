import { DistrictAreaType } from './district.ts';

export function numberParser(i: string): number | null {
  const parsed = parseFloat(i.replaceAll(',', ''));
  return isNaN(parsed) ? null : parsed;
}

export function districtTypeParser(i: string): DistrictAreaType {
  switch (i) {
    case 'พื้นที่ศูนย์กลางธุรกิจและพาณิชยกรรม':
      return 'business';
    case 'พื้นที่อนุรักษ์ศิลปวัฒนธรรมและส่งเสริมการท่องเที่ยว':
      return 'tourism-and-cultural';
    case 'พื้นที่อยู่อาศัยชานเมือง':
      return 'suburban';
    case 'พื้นที่อยู่อาศัย':
      return 'residence';
  }
  return null;
}