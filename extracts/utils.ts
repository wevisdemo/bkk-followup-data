
export function numberParser(i: string): number | null {
  const parsed = parseFloat(i.replaceAll(',', ''));
  return isNaN(parsed) ? null : parsed;
}